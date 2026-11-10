
Misalkan $f$ adalah suatu operasi grup (fungsi asosiatif biner pada suatu himpunan dengan elemen identitas dan elemen invers) dan $A$ adalah sebuah array berisi bilangan bulat sepanjang $N$. Nyatakan notasi infiks dari $f$ sebagai $*$; yaitu, $f(x,y) = x*y$ untuk bilangan bulat $x,y$ sembarang. (Karena bersifat asosiatif, kita akan mengabaikan tanda kurung untuk urutan penerapan $f$ saat menggunakan notasi infiks.)

Fenwick tree adalah sebuah struktur data yang dapat:

* menghitung nilai dari fungsi $f$ pada *range* yang diberikan $[l, r]$ (yaitu $A_l * A_{l+1} * \dots * A_r$) dalam waktu $O(\log N)$
* memperbarui (*update*) nilai dari suatu elemen pada $A$ dalam waktu $O(\log N)$
* membutuhkan memori $O(N)$ (jumlah memori yang sama yang dibutuhkan oleh $A$)
* mudah digunakan dan di-*code*, terutama pada kasus array multidimensi

Aplikasi paling umum dari Fenwick tree adalah menghitung *range sum* (jumlah dalam suatu *range*). Sebagai contoh, dengan menggunakan operasi penjumlahan pada himpunan bilangan bulat sebagai operasi grup, yaitu $f(x,y) = x + y$: operasi biner $*$ adalah $+$ dalam kasus ini, sehingga $A_l * A_{l+1} * \dots * A_r = A_l + A_{l+1} + \dots + A_{r}$.

Fenwick tree juga disebut sebagai **Binary Indexed Tree (BIT)**. Struktur data ini pertama kali dijelaskan dalam sebuah makalah (*paper*) berjudul *"A new data structure for cumulative frequency tables"* (Peter M. Fenwick, 1994).

## Description

### Overview

Demi kesederhanaan, kita akan berasumsi bahwa fungsi $f$ didefinisikan sebagai $f(x,y) = x + y$ pada bilangan bulat.

Misalkan kita diberikan sebuah *array* berisi bilangan bulat, $A[0 \dots N-1]$. (Perhatikan bahwa kita menggunakan *zero-based indexing* / penomoran berbasis nol.) Fenwick tree sebenarnya hanyalah sebuah *array*, $T[0 \dots N-1]$, di mana setiap elemennya bernilai sama dengan jumlah elemen dari $A$ pada suatu *range* $[g(i), i]$:

$$T_i = \sum_{j = g(i)}^{i}{A_j}$$

dengan $g$ adalah suatu fungsi yang memenuhi $0 \le g(i) \le i$. Kita akan mendefinisikan $g$ pada paragraf-paragraf berikutnya.

Struktur data ini disebut sebagai *tree* (pohon) karena terdapat representasi yang bagus dalam bentuk pohon, meskipun kita tidak perlu memodelkan pohon aktual dengan *nodes* (simpul) dan *edges* (sisi). Kita hanya perlu memelihara (*maintain*) *array* $T$ untuk menangani semua *queries*.

Catatan: Fenwick tree yang disajikan di sini menggunakan *zero-based indexing*. Banyak orang menggunakan versi Fenwick tree yang menggunakan *one-based indexing* (berbasis satu). Oleh karena itu, kamu juga akan menemukan implementasi alternatif yang menggunakan *one-based indexing* di bagian implementasi. Kedua versi tersebut setara dalam hal kompleksitas waktu dan memori.

Sekarang kita dapat menuliskan beberapa *pseudo-code* untuk kedua operasi yang disebutkan di atas. Di bawah ini, kita mengambil jumlah elemen dari $A$ pada *range* $[0, r]$ dan memperbarui (*update* / menaikkan) suatu elemen $A_i$:

```cpp
int sum(int r) {
    int res = 0;
    while (r >= 0) {
        res += t[r];
        r = g(r) - 1;
    }
    return res;
}

void increase(int i, int delta) {
    for (int j = i; j < n; j = j | (j + 1)) { 
        t[j] += delta;
    }
}
```

Fungsi `sum` bekerja sebagai berikut:

1. Pertama, fungsi ini menambahkan jumlah dari *range* $[g(r), r]$ (yaitu $T[r]$) ke dalam *result*.
2. Kemudian, fungsi ini "melompat" ke *range* $[g(g(r)-1), g(r)-1]$ dan menambahkan jumlah *range* tersebut ke *result*.
3. Proses ini berlanjut sampai ia "melompat" dari $[0, g(g( \dots g(r)-1 \dots -1)-1)]$ ke $[g(-1), -1]$; di sinilah fungsi `sum` berhenti melompat.

Fungsi `increase` bekerja dengan analogi yang sama, tetapi ia "melompat" ke arah *indices* yang semakin besar:

1. Jumlah untuk setiap *range* dengan bentuk $[g(j), j]$ yang memenuhi kondisi $g(j) \le i \le j$ akan ditambah sebesar *delta*; yaitu, `t[j] += delta`. Oleh karena itu, fungsi ini memperbarui (*update*) semua elemen pada $T$ yang berkorespondensi dengan *range* tempat $A_i$ berada.

Kompleksitas dari kedua fungsi `sum` dan `increase` bergantung pada fungsi $g$. Ada banyak cara untuk memilih fungsi $g$ sedemikian rupa sehingga $0 \le g(i) \le i$ untuk setiap $i$. Sebagai contoh, fungsi $g(i) = i$ dapat digunakan, yang menghasilkan $T = A$ (dalam kasus ini, *summation queries* menjadi lambat). Kita juga bisa mengambil fungsi $g(i) = 0$. Hal ini akan berkorespondensi dengan *prefix sum arrays* (dalam kasus ini, pencarian jumlah dari *range* $[0, i]$ hanya membutuhkan waktu konstan; namun, *updates* menjadi lambat). Bagian yang cerdas dari algoritma untuk Fenwick tree adalah bagaimana ia menggunakan definisi khusus dari fungsi $g$ yang dapat menangani kedua operasi tersebut dalam waktu $O(\log N)$.

### Definition of $g(i)$

Komputasi dari $g(i)$ didefinisikan menggunakan operasi sederhana berikut: kita mengganti semua *trailing $1$ bits* (bit $1$ di ujung belakang) pada representasi biner dari $i$ menjadi bit $0$.

Dengan kata lain, jika *least significant digit* (digit paling tidak signifikan / bit paling kanan) dari $i$ dalam biner adalah $0$, maka $g(i) = i$. Jika tidak, *least significant digit*-nya adalah $1$, dan kita mengambil bit $1$ tersebut beserta semua *trailing $1$s* lainnya lalu membalikkan (*flip*) semuanya.

Sebagai contoh, kita peroleh:

$$\begin{align} g(11) = g(1011_2) = 1000_2 &= 8 \\ g(12) = g(1100_2) = 1100_2 &= 12 \\ g(13) = g(1101_2) = 1100_2 &= 12 \\ g(14) = g(1110_2) = 1110_2 &= 14 \\ g(15) = g(1111_2) = 0000_2 &= 0 \end{align}$$

Terdapat sebuah implementasi sederhana menggunakan *bitwise operations* untuk operasi non-trivial yang dijelaskan di atas:

$$g(i) = i ~\&~ (i+1),$$

di mana $\&$ adalah operator *bitwise AND*. Tidak sulit untuk meyakinkan diri sendiri bahwa solusi ini melakukan hal yang sama persis seperti operasi yang dijelaskan di atas.

Sekarang, kita hanya perlu mencari cara untuk melakukan iterasi pada semua $j$, sedemikian rupa sehingga $g(j) \le i \le j$.

Sangat mudah untuk melihat bahwa kita dapat menemukan semua $j$ tersebut dengan mulai dari $i$ dan membalikkan (*flip*) bit $0$ terakhir yang belum di-set (*unset bit*). Kita akan menyebut operasi ini sebagai $h(j)$. Sebagai contoh, untuk $i = 10$ kita miliki:

$$\begin{align} 10 &= 0001010_2 \\ h(10) = 11 &= 0001011_2 \\ h(11) = 15 &= 0001111_2 \\ h(15) = 31 &= 0011111_2 \\ h(31) = 63 &= 0111111_2 \\ \vdots & \end{align}$$

Tidak mengherankan, ada juga cara sederhana untuk melakukan $h$ menggunakan *bitwise operations*:

$$h(j) = j ~\vert{}~ (j+1),$$

di mana $\vert{}$ adalah operator *bitwise OR*.

Gambar berikut menunjukkan kemungkinan interpretasi dari Fenwick tree sebagai sebuah *tree* (pohon). *Nodes* (simpul) dari *tree* tersebut menunjukkan *ranges* (rentang) yang dicakupnya.

![](Fenwick%20Tree-2.png)
## Implementation

### Finding sum in one-dimensional array

Di sini kami menyajikan implementasi dari Fenwick tree untuk *sum queries* (kueri penjumlahan) dan *single updates* (pembaruan tunggal).

Fenwick tree standar hanya dapat menjawab *sum queries* dengan tipe $[0, r]$ menggunakan fungsi `sum(int r)`, namun kita juga dapat menjawab kueri jenis lain dengan tipe $[l, r]$ dengan cara menghitung dua buah jumlah, yaitu $[0, r]$ dan $[0, l-1]$, lalu mengurangkannya. Hal ini ditangani di dalam method `sum(int l, int r)`.

Selain itu, implementasi ini mendukung dua buah *constructors*. Kamu bisa membuat Fenwick tree yang diinisialisasi dengan nilai nol, atau kamu bisa mengubah *array* yang sudah ada ke dalam bentuk Fenwick.

```cpp
struct FenwickTree {
    vector<int> bit;  // binary indexed tree
    int n;

    FenwickTree(int n) {
        this->n = n;
        bit.assign(n, 0);
    }

    FenwickTree(vector<int> const &a) : FenwickTree(a.size()) {
        for (size_t i = 0; i < a.size(); i++)
            add(i, a[i]);
    }

    int sum(int r) {
        int ret = 0;
        for (; r >= 0; r = (r & (r + 1)) - 1)
            ret += bit[r];
        return ret;
    }

    int sum(int l, int r) {
        return sum(r) - sum(l - 1);
    }

    void add(int idx, int delta) {
        for (; idx < n; idx = idx | (idx + 1))
            bit[idx] += delta;
    }
};
```

### Linear construction

Implementasi di atas membutuhkan waktu $O(N \log N)$. Kita dapat meningkatkannya menjadi waktu $O(N)$.

Gagasannya adalah bahwa angka $a[i]$ pada indeks $i$ akan berkontribusi pada *range* yang disimpan di $bit[i]$, dan pada semua *range* yang menjadi kontribusi dari indeks $i \mid (i + 1)$. Jadi, dengan menambahkan angka-angka secara berurutan, kamu hanya perlu mendorong (*push*) jumlah saat ini lebih jauh ke *range* berikutnya, di mana jumlah tersebut nantinya akan didorong lebih jauh lagi ke *range* berikutnya, dan seterusnya.

```cpp
FenwickTree(vector<int> const &a) : FenwickTree(a.size()){
    for (int i = 0; i < n; i++) {
        bit[i] += a[i];
        int r = i | (i + 1);
        if (r < n) bit[r] += bit[i];
    }
}
```

### Finding minimum of  $[0, r]$  in one-dimensional array

Sangat jelas bahwa tidak ada cara yang mudah untuk mencari nilai minimum dari *range* $[l, r]$ menggunakan Fenwick tree, karena Fenwick tree hanya dapat menjawab *queries* dengan tipe $[0, r]$. Selain itu, setiap kali sebuah nilai diperbarui (*update*), nilai yang baru harus lebih kecil dari nilai yang saat ini ada. Kedua batasan signifikan ini terjadi karena operasi *min* bersama dengan himpunan bilangan bulat tidak membentuk sebuah grup, karena tidak adanya elemen invers (*inverse elements*).

```cpp
struct FenwickTreeMin {
    vector<int> bit;
    int n;
    const int INF = (int)1e9;

    FenwickTreeMin(int n) {
        this->n = n;
        bit.assign(n, INF);
    }

    FenwickTreeMin(vector<int> a) : FenwickTreeMin(a.size()) {
        for (size_t i = 0; i < a.size(); i++)
            update(i, a[i]);
    }

    int getmin(int r) {
        int ret = INF;
        for (; r >= 0; r = (r & (r + 1)) - 1)
            ret = min(ret, bit[r]);
        return ret;
    }

    void update(int idx, int val) {
        for (; idx < n; idx = idx | (idx + 1))
            bit[idx] = min(bit[idx], val);
    }
};
```

Catatan: Sangatlah mungkin untuk mengimplementasikan sebuah Fenwick tree yang dapat menangani *arbitrary minimum range queries* dan *arbitrary updates*. *Paper* berjudul *"Efficient Range Minimum Queries using Binary Indexed Trees"* menjelaskan pendekatan tersebut. Namun, dengan pendekatan itu, kamu perlu memelihara (*maintain*) *binary indexed tree* kedua di atas data tersebut dengan struktur yang sedikit berbeda, karena satu *tree* saja tidak cukup untuk menyimpan nilai dari semua elemen di dalam *array*. Implementasinya juga jauh lebih sulit dibandingkan implementasi normal untuk *sums* (penjumlahan).

### Finding sum in two-dimensional array

Seperti yang telah diklaim sebelumnya, sangatlah mudah untuk mengimplementasikan Fenwick tree untuk *multidimensional array* (array multidimensi).

```cpp
struct FenwickTree2D {
    vector<vector<int>> bit;
    int n, m;

    // init(...) { ... }

    int sum(int x, int y) {
        int ret = 0;
        for (int i = x; i >= 0; i = (i & (i + 1)) - 1)
            for (int j = y; j >= 0; j = (j & (j + 1)) - 1)
                ret += bit[i][j];
        return ret;
    }

    void add(int x, int y, int delta) {
        for (int i = x; i < n; i = i | (i + 1))
            for (int j = y; j < m; j = j | (j + 1))
                bit[i][j] += delta;
    }
};
```

Berikut adalah terjemahan teks tersebut beserta *pseudo-code*-nya ke dalam kode C++:

### One-based indexing approach

Untuk pendekatan ini, kita mengubah sedikit persyaratan dan definisi untuk $T[]$ dan $g()$. Kita ingin $T[i]$ menyimpan jumlah dari $[g(i)+1; i]$. Hal ini sedikit mengubah implementasinya, dan memungkinkan definisi yang sama bagusnya untuk $g(i)$:

```cpp
int sum(int r) {
    int res = 0;
    while (r > 0) {
        res += t[r];
        r = g(r); // r = r - (r & -r)
    }
    return res;
}

void increase(int i, int delta) {
    for (int j = i; j <= n; j += (j & -j)) {
        t[j] += delta;
    }
}
```

Komputasi dari $g(i)$ didefinisikan sebagai: membalikkan (*toggling*) bit $1$ terakhir yang berstatus *set* (menyala) dalam representasi biner dari $i$.

$$\begin{align} g(7) = g(111_2) = 110_2 &= 6 \\ g(6) = g(110_2) = 100_2 &= 4 \\ g(4) = g(100_2) = 000_2 &= 0 \end{align}$$

Bit terakhir yang menyala tersebut dapat diekstrak menggunakan $i ~\&~ (-i)$, sehingga operasinya dapat diekspresikan sebagai:

$$g(i) = i - (i ~\&~ (-i)).$$

Dan tidak sulit untuk melihat bahwa kamu perlu mengubah semua nilai $T[j]$ pada barisan $i,~ h(i),~ h(h(i)),~ \dots$ ketika kamu ingin memperbarui (*update*) $A[j]$, di mana $h(i)$ didefinisikan sebagai:

$$h(i) = i + (i ~\&~ (-i)).$$

Seperti yang bisa kamu lihat, manfaat utama dari pendekatan ini adalah operasi-operasi bitwise tersebut saling melengkapi dengan sangat baik.

Implementasi berikut dapat digunakan seperti implementasi lainnya, namun ia menggunakan *one-based indexing* secara internal.

```cpp
struct FenwickTreeOneBasedIndexing {
    vector<int> bit;  // binary indexed tree
    int n;

    FenwickTreeOneBasedIndexing(int n) {
        this->n = n + 1;
        bit.assign(n + 1, 0);
    }

    FenwickTreeOneBasedIndexing(vector<int> a)
        : FenwickTreeOneBasedIndexing(a.size()) {
        for (size_t i = 0; i < a.size(); i++)
            add(i, a[i]);
    }

    int sum(int idx) {
        int ret = 0;
        for (++idx; idx > 0; idx -= idx & -idx)
            ret += bit[idx];
        return ret;
    }

    int sum(int l, int r) {
        return sum(r) - sum(l - 1);
    }

    void add(int idx, int delta) {
        for (++idx; idx < n; idx += idx & -idx)
            bit[idx] += delta;
    }
};
```

Berikut adalah terjemahan materi dan *pseudo-code* di atas langsung ke dalam implementasi kode C++:

## Range operations

Sebuah Fenwick tree dapat mendukung operasi *range* berikut:

1. *Point Update and Range Query*
2. *Range Update and Point Query*
3. *Range Update and Range Query*
4. *Point Update and Range Query*
### 1. Point Update and Range Query

Ini hanyalah Fenwick tree biasa seperti yang dijelaskan di atas.

### 2. Range Update and Point Query

Dengan menggunakan trik sederhana, kita juga bisa melakukan operasi sebaliknya: menaikkan nilai pada suatu *range* (*increasing ranges*) dan melakukan *query* untuk nilai tunggal (*single values*).

Misalkan Fenwick tree diinisialisasi dengan nilai nol. Anggaplah kita ingin menaikkan interval $[l, r]$ sebesar $x$. Kita melakukan dua operasi *point update* pada Fenwick tree, yaitu `add(l, x)` dan `add(r+1, -x)`.

Jika kita ingin mendapatkan nilai dari $A[i]$, kita hanya perlu mengambil *prefix sum* menggunakan metode *range sum* biasa. Untuk melihat mengapa ini benar, kita bisa fokus kembali pada operasi penambahan sebelumnya. Jika $i < l$, maka kedua operasi *update* tidak memberikan efek apa pun pada *query* dan kita mendapatkan jumlah $0$. Jika $i \in [l, r]$, maka kita mendapatkan jawaban $x$ karena adanya operasi *update* pertama. Dan jika $i > r$, maka operasi *update* kedua akan membatalkan efek dari operasi yang pertama.

Implementasi berikut menggunakan *one-based indexing*.

```cpp
void add(int idx, int val) {
    for (++idx; idx < n; idx += idx & -idx)
        bit[idx] += val;
}

void range_add(int l, int r, int val) {
    add(l, val);
    add(r + 1, -val);
}

int point_query(int idx) {
    int ret = 0;
    for (++idx; idx > 0; idx -= idx & -idx)
        ret += bit[idx];
    return ret;
}
```

*Catatan:* Tentu saja dimungkinkan juga untuk menaikkan satu titik tunggal $A[i]$ dengan `range_add(i, i, val)`.

### 3. Range Update and Range Query

Untuk mendukung *range updates* sekaligus *range queries*, kita akan menggunakan dua buah BIT, yaitu $B_1[]$ dan $B_2[]$, yang diinisialisasi dengan nilai nol.

Anggaplah kita ingin menaikkan interval $[l, r]$ sebesar nilai $x$. Serupa dengan metode sebelumnya, kita melakukan dua *point updates* pada $B_1$: `add(B1, l, x)` dan `add(B1, r+1, -x)`. Dan kita juga memperbarui $B_2$. Detailnya akan dijelaskan nanti.

```cpp
void range_add(int l, int r, long long x) {
    add(B1, l, x);
    add(B1, r + 1, -x);
    add(B2, l, x * (l - 1));
    add(B2, r + 1, -x * r);
}
```

Setelah *range update* $(l, r, x)$, *range sum query* harus mengembalikan nilai-nilai berikut:

$$sum[0, i]= \begin{cases} 0 & i < l \\ x \cdot (i-(l-1)) & l \le i \le r \\ x \cdot (r-l+1) & i > r \end{cases}$$

Kita dapat menuliskan *range sum* sebagai selisih dari dua suku (*terms*), di mana kita menggunakan $B_1$ untuk suku pertama dan $B_2$ untuk suku kedua. Selisih dari kueri-kueri tersebut akan memberikan *prefix sum* pada $[0, i]$.

$$\begin{align} sum[0, i] &= sum(B_1, i) \cdot i - sum(B_2, i) \\ &= \begin{cases} 0 \cdot i - 0 & i < l \\ x \cdot i - x \cdot (l-1) & l \le i \le r \\ 0 \cdot i - (x \cdot (l-1) - x \cdot r) & i > r \end{cases} \end{align}$$

Ekspresi terakhir tersebut persis sama dengan suku-suku yang dibutuhkan. Dengan demikian, kita dapat menggunakan $B_2$ untuk memotong suku-suku ekstra saat kita mengalikan $B_1[i] \times i$.

Kita dapat mencari *arbitrary range sums* dengan menghitung *prefix sums* untuk $l-1$ dan $r$, lalu mengambil selisih keduanya lagi.

```cpp
void add(vector<long long>& b, int idx, long long x, int N) {
    while (idx <= N) {
        b[idx] += x;
        idx += idx & -idx;
    }
}

void range_add(int l, int r, long long x, vector<long long>& B1, vector<long long>& B2, int N) {
    add(B1, l, x, N);
    add(B1, r + 1, -x, N);
    add(B2, l, x * (l - 1), N);
    add(B2, r + 1, -x * r, N);
}

long long sum(const vector<long long>& b, int idx) {
    long long total = 0;
    while (idx > 0) {
        total += b[idx];
        idx -= idx & -idx;
    }
    return total;
}

long long prefix_sum(int idx, const vector<long long>& B1, const vector<long long>& B2) {
    return sum(B1, idx) * idx - sum(B2, idx);
}

long long range_sum(int l, int r, const vector<long long>& B1, const vector<long long>& B2) {
    return prefix_sum(r, B1, B2) - prefix_sum(l - 1, B1, B2);
}
```