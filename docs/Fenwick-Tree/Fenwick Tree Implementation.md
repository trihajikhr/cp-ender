# Implementasi Fenwick Tree
Fenwick Tree memiliki implementasi yang luas. Ini mengharuskan kita mengetahui apa tantangan yang sebenarnya ingin kita selesaikan dengan bantuan struktur data ini, sehingga kita tidak menghabiskan waktu mengimplementasikan fungsional yang ternyata tidak diperlukan.

> [!CAUTION]
> Implementasi Fenwick Tree ini akan menggunakan 1-based index! Baca [Fenwick Tree 0-based vs 1-based Indexing](Fenwick%20Tree%200-based%20vs%201-based%20Indexing.md) untuk memahami mengapa pemberitahuan ini menjadi penting!
> 
> Implementasi Fenwick Tree ini sepenuhnya beroperasi menggunakan 1-based index. Semua parameter internal maupun eksternal yang diterima oleh method kelas—baik $idx$, $l$, maupun $r$—bersifat $1$-based. Oleh karena itu, tugas fungsi pemanggil (*caller*) adalah untuk melakukan penyesuaian parameter (misalnya menggeser indeks $0$-based dari luar menjadi $1$-based sebelum dilempar ke dalam kelas) jika lingkungan di sekitar fungsi caller menggunakan standar $0$-based index.

![](Do%20you%20know%20what%20a%20Fenwick%20tree%20(binary%20indexed%20tree)%20is.mp4)

## Class Dasar
Membuat class Fenwick Tree akan mempermudah penggunaan struktur data ini, sehingga sangat disarankan menggunakan bantuan class. 

Buat beberapa fungsionalitas paling dasar yang harus ada pada Fenwick Tree, yaitu sebagai berikut:

```cpp
class FenwickTree {
   private:
    vector<long long> bit;
    int n;

    void add(int idx, long long val) {
        for ( ; idx <= n; idx += idx & -idx) {
            bit[idx] += val;
        }
    }

    auto sum(int idx) -> long long {
        long rest = 0;
        for (; idx > 0; idx -= idx & -idx) {
            rest += bit[idx];
        }

        return rest;
    }

   public:
    explicit FenwickTree(int size) {
        this->n = size;
        bit.assign(n + 1, 0);
    }

    explicit FenwickTree(vector<int>& arr) : FenwickTree((int)arr.size()) {
        for (int i = 0; i < (int)arr.size(); i++) {
            add(i + 1, arr[i]);
        }
    }
};
```

*Kode Program 1. Class dasar FenwickTree*

## Fungsi `sum()` dan `add()`

![](Fenwick%20Tree%20Implementation-1.png)

*Pola internal struktur data Fenwick Tree / Binary Indexed Tree*

Oke, dari implementasi dasar diatas, bisa terlihat jelas bahwa terdapat fungsi internal berupa `add()` dan `sum()`. Jadi berikut penjelasanya:

### Kegunaan Fungsi `add` dan `sum` serta Hubungannya dengan Fenwick Tree

Pada **Fenwick Tree** (atau *Binary Indexed Tree*), setiap elemen pada array internal `bit` (dengan indeks 1-based dari $1$ hingga $n$) tidak menyimpan nilai elemen tunggal secara langsung, melainkan menyimpan **jumlah parsial** (*partial sum*) dari suatu rentang elemen yang panjangnya ditentukan oleh nilai *Least Significant Bit* (LSB) dari indeks tersebut. Panjang rentang yang dicakup oleh `bit[idx]` sama dengan $\text{LSB}(\text{idx}) = \text{idx} \ \& \ (-\text{idx})$, yang mencakup tepat $\text{LSB}(\text{idx})$ elemen yang berakhir di indeks `idx`, yaitu pada interval $[\text{idx} - \text{LSB}(\text{idx}) + 1, \text{idx}]$.

### Fungsi `add` dan `sum`

```cpp
void add(int idx, long long val) {
	for ( ; idx <= n; idx += idx & -idx) {
		bit[idx] += val;
	}
}
```

Fungsi `add(int idx, long long val)` berperan sebagai operasi pembaruan titik (*point update*) yang menambahkan nilai `val` ke elemen pada posisi `idx` (1-based) sekaligus memperbarui seluruh entri pada `bit` yang rentangnya mencakup `idx`. Secara matematis, perubahan sebesar `val` pada indeks `idx` harus diteruskan ke setiap posisi berikutnya yang menaungi `idx` agar invarian jumlah parsial tetap terjaga. Penelusuran ini dilakukan dengan melompat maju menggunakan `idx += idx & -idx` selama `idx <= n`, karena menambahkan $\text{LSB}(\text{idx})$ mengarahkan indeks ke blok cakupan berikutnya dalam kompleksitas waktu $O(\log n)$. Pada konstruktor `FenwickTree(vector<int>& arr)`, pemanggilan `add(i + 1, arr[i])` secara berulang menginisialisasi struktur data dari array masukan dalam waktu $O(n \log n)$.

```cpp
auto sum(int idx) -> long long {
	long rest = 0;
	for (; idx > 0; idx -= idx & -idx) {
		rest += bit[idx];
	}

	return rest;
}
```

Sebaliknya, fungsi `sum(int idx)` berperan sebagai operasi kueri jumlah prefiks (*prefix sum query*) yang menghitung total nilai elemen pada rentang indeks 1-based $[1, \text{idx}]$ dalam kompleksitas waktu $O(\log n)$. Karena `bit[idx]` menyimpan akumulasi dari $\text{LSB}(\text{idx})$ elemen yang berakhir di `idx`, rentang $[1, \text{idx}]$ dapat dipecah menjadi beberapa blok *disjoint* yang masing-masing direpresentasikan langsung oleh satu entri pada `bit`. Setelah menjumlahkan `bit[idx]`, sisa rentang yang belum terhitung berada pada interval $[1, \text{idx} - \text{LSB}(\text{idx})]$. Perulangan pun bergerak mundur menuju $0$ menggunakan `idx -= idx & -idx` selama `idx > 0` sambil mengakumulasikan nilai `bit[idx]`.

### Hubungan Keduanya dengan Cara Kerja Fenwick Tree

Keterkaitan antara `add` dan `sum` terletak pada pemanfaatan representasi biner indeks untuk membagi dan menggabungkan rentang secara logaritmik tanpa perlu membangun struktur pohon eksplisit di memori:

* **`add` menyebarkan perubahan ke atas/kanan** (`idx += idx & -idx`) menuju seluruh blok akumulasi yang mencakup indeks target.
* **`sum` menggabungkan blok ke bawah/kiri** (`idx -= idx & -idx`) dari blok-blok *disjoint* hingga membentuk jumlah prefiks dari awal array.
* **Kueri rentang tertutup $[l, r]$** (dengan $1 \le l \le r \le n$) dapat dihitung dari selisih dua pemanggilan `sum`, yaitu $\text{sum}(r) - \text{sum}(l - 1)$, dalam waktu $O(\log n)$.

## Constructor 

Class `FenwickTree` menyediakan dua konstruktor `explicit` untuk menyiapkan kapasitas struktur data serta menginisialisasi array internal `bit` menggunakan indeks 1-based dari $1$ hingga $n$:

* **Konstruktor ukuran (`FenwickTree(int size)`)** menetapkan batas kapasitas elemen `this->n = size` dan mengalokasikan `bit` berukuran `n + 1` yang seluruh nilainya diinisialisasi dengan `0` (`bit.assign(n + 1, 0)`). Indeks `0` dibiarkan tidak terpakai agar manipulasi *Least Significant Bit* ($\text{LSB}(x) = x \ \& \ (-x)$) berjalan konsisten pada rentang indeks $1$ hingga $n$, dengan kompleksitas waktu dan ruang $O(n)$.
* **Konstruktor dari array (`FenwickTree(vector<int>& arr)`)** menggunakan *delegating constructor* `: FenwickTree((int)arr.size())` untuk membentuk struktur kosong berukuran `arr.size()`, lalu mengisi nilainya dengan memanggil `add(i + 1, arr[i])` untuk setiap indeks `i` (0-based) menjadi indeks `i + 1` (1-based). Setiap pemanggilan `add` berjalan dalam $O(\log n)$, sehingga total waktu inisialisasi adalah $O(n \log n)$ dengan kompleksitas ruang $O(n)$.

Penanda `explicit` mencegah konversi tipe implisit yang tidak disengaja (misalnya saat `int` atau `vector<int>` diteruskan ke konteks yang mengharapkan objek `FenwickTree`), sedangkan tipe `long long` pada `bit` menjaga agar akumulasi jumlah parsial tidak mudah mengalami *integer overflow*.

## 1. Point Update & Range Query

Kasus paling umum yang biasanya diselesaikan dengan menggunakan Fenwick Tree adalah mencari jumlah elemen dari array $A$ dengan $N$ elemen, dimana query yang diberikan biasanya berupa query $l$ dan $r$, yang artinya kita diminta untuk mencari jumlah elemen dari rentang $[l,r]$. Lalu, ditengah prosesnya, kita harus melakuakan update pada nilai-nilai elemen yang ada pada array $A$, sambil tetap menjawab query yang diberikan dengan benar dan dengan kompleksitas waktu yang efisien.

Fenwick Tree hanya bisa digunakan untuk mencari jumlah elemen dari rentang $[0, r]$ saja. Namun tetap bisa digunakan untuk mencari jumlah elemen dari rentang $[l,r]$ dengan cara melakukan operasi $sum([0, r]) - sum([0, l-1])$. Ini mirip seperti teknik pada prefix sum. Hanya saja, pada Fenwick Tree, update pada salah satu elemen pada array bisa dilakukan dengan kompleksitas $O(\log \;n)$, yang jauh lebih efisien dibandingkan prefix sum yang membutuhkan kompleksitas $O(n)$ untuk membangun ulang prefix arraynya.

Maka, implementasinya bisa kita modifikasi seperti berikut:

```cpp
class FenwickTree {
   private:
    vector<long long> bit;
    int n;

    void add(int idx, long long val) {
        for (; idx <= n; idx += idx & -idx) {
            bit[idx] += val;
        }
    }

    auto sum(int idx) -> long long {
        long rest = 0;
        for (; idx > 0; idx -= idx & -idx) {
            rest += bit[idx];
        }

        return rest;
    }

   public:
    explicit FenwickTree(int size) {
        this->n = size;
        bit.assign(n + 1, 0);
    }

    explicit FenwickTree(vector<int>& arr) : FenwickTree((int)arr.size()) {
        for (int i = 0; i < (int)arr.size(); i++) {
            add(i + 1, arr[i]);
        }
    }

    // UPDATE
    auto rangeSum(int l, int r) -> long long{
        return sum(r) - sum(l-1);
    } 
    
    void pointIncrease(int idx, long long val) {
        add(idx, val);
    }
};
```

*Kode Program 2. rangesum() + pointIncrease()*

Perhatikan bahwa pada fungsi `pointIncrease()`, pengubahan nilai pada elemen  berindex $idx$ sebesar $val$ sebenarnya hanya memanggil fungsi `add()`, yang pada akhirnya membuat operasi yang terjadi menjadi bersifat kumulatif. 

Misalnya, jika semisal ingin mengganti elemen pada index $4$ yang sebelumnya bernilai $10$ menjadi $90$, alih-alih nilainya berubah menjadi $90$, fungsi yang kita panggil justru akan melakukan operasi yang pada akhirnya menjumlahkanya, menggantinya menjadi $100$ karena sifat kumulatifnya. 

Jadi, operasi diatas berguna ketika yang ingin dilakukan adalah melakukan **penambahan** atau **pengurangan** sebesar $val$, bukan menggantinya.

> [!INFO]
> Itulah sebabnya nama fungsinya aku beri nama dengan `pointIncrease()` agar tidak keliru dalam memahami :)

Jika yang diinginkan adalah benar-benar mengganti elemen yang ditunjuk menjadi elemen $val$ yang dimaksud, maka kita membutuhkan memori tambahan sebagai media penyimpanan array asli, untuk mentrack perubahan yang terjadi, sekaligus mengambil nilai selisih antara nilai $val$ yang baru dengan nilai lama dengan lebih mudah.

Mekanismenya adalah, array bantu tersebut akan menyimpan perubahan elemen yang terjadi. Ketika terjadi perubahan elemen, nilai delta atau selisih pada posisi indeks yang sama diambil, dan fungsi `add()` akan dipanggil dengan parameter berupa selisih antara nilai baru dikurangi nilai yang lama, atau $add(newVal - ori[idx])$, dengan $ori$ adalah array bantu, dan $newVal$ adalah elemen baru yang akan menimpa elemen lama di posisi $idx$.

Berikut adalah perubahan yang diperlukan:

```cpp
class FenwickTree {
   private:
    vector<long long> bit;
    vector<long long> ori;  // array tracker
    int n;

    void add(int idx, long long val) {
        for (; idx <= n; idx += idx & -idx) {
            bit[idx] += val;
        }
    }

    auto sum(int idx) -> long long {
        long rest = 0;
        for (; idx > 0; idx -= idx & -idx) {
            rest += bit[idx];
        }

        return rest;
    }

   public:
    explicit FenwickTree(int size) {
        this->n = size;
        bit.assign(n + 1, 0);
        ori.assign(n + 1, 0);
    }

    explicit FenwickTree(vector<int>& arr) : FenwickTree((int)arr.size()) {
        // lakukan copy pada array asli, pertahankan 1-based-index
        for (int i = 1; i <= n; i++) {
            ori[i] = arr[i - 1];
        }

        for (int i = 0; i < (int)arr.size(); i++) {
            add(i + 1, arr[i]);
        }
    }

    auto rangeSum(int l, int r) -> long long { 
        return sum(r) - sum(l - 1); 
    }

    // UPDATE
    void pointIncrease(int idx, int val) {
        add(idx, val);

        // operasi kumulatif juga harus di track
        // karena bersifat merubah elemen
        ori[idx] += val;
    }

    void pointUpdate(int idx, long long newVal) {
        long long delta = newVal - ori[idx];
        ori[idx] = newVal;
        add(idx, delta);
    }
};
```

*Kode Program 3. pointUpdate() + array tracker*

Perhatikan bahwa kita membuat fungsi baru berupa `pointUpdate()` yang menjalankan mekanisme pembaruan elemen.

## 2. Point Update & Point Query
Jika permintaan query juga bisa hanya berupa posisi indeks tertentu, maka dengan implementasi yang lebih sederhana seperti **Kode Program 2** yang sudah kita buat diatas, kita bisa menjawabnya dengan mudah dengan cara:

```cpp
auto getPoint(int idx) -> long long {
	return sum(idx) - sum(idx-1);
}
```

Namun, operasi `sum()` sendiri akan membutuhkan kompleksitas waktu berupa $O(\log \;n)$. Sehingga, jika implementasi kita sudah ditahap **Kode Program 3**, maka akan jauh lebih baik untuk menggunakan implementasi berikut:

```cpp
auto getPoint(int idx) -> long long {
	return ori[idx];
}
```

Kita mengakses langsung array tracker dengan index yang diberikan, dan langsung mengembalikan nilainya. Dengan cara ini, komlpleksitas waktu yang dibutuhkan menjadi konstan atau cukup $O(1)$ saja, menjadi sangat efisien.

Mungkin berikut adalah update yang dilakukan pada class FenwickTree kita:

```cpp
class FenwickTree {
   private:
    vector<long long> bit;
    vector<long long> ori;
    int n;

    void add(int idx, long long val) {
        for (; idx <= n; idx += idx & -idx) {
            bit[idx] += val;
        }
    }

    auto sum(int idx) -> long long {
        long rest = 0;
        for (; idx > 0; idx -= idx & -idx) {
            rest += bit[idx];
        }

        return rest;
    }

   public:
    explicit FenwickTree(int size) {
        this->n = size;
        bit.assign(n + 1, 0);
        ori.assign(n + 1, 0);
    }

    explicit FenwickTree(vector<int>& arr) : FenwickTree((int)arr.size()) {
        for (int i = 1; i <= n; i++) {
            ori[i] = arr[i - 1];
        }

        for (int i = 0; i < (int)arr.size(); i++) {
            add(i + 1, arr[i]);
        }
    }

    auto rangeSum(int l, int r) -> long long { 
        return sum(r) - sum(l - 1); 
    }

    void pointIncrease(int idx, int val) {
        add(idx, val);
        ori[idx] += val;
    }

    void pointUpdate(int idx, long long newVal) {
        long long delta = newVal - ori[idx];
        ori[idx] = newVal;
        add(idx, delta);
    }

    // UPDATE
    auto getPoint(int idx) -> long long {
        return ori[idx];
    }
};
```

*Kode Program 4. getPoint()*

## 3. Range Update & Range Query
Pada Fenwick Tree standar, operasi point update memiliki kompleksitas berupa $O(\log \; n)$. Ketika kita diminta untuk melakukan update elemen pada rentang $[l,r]$, dimana setiap elemen pada indeks $i$ yang memenuhi $l \le i \le r$ akan mengalami penambahan sebesar $X$, mungkin terpikir bagi kita untuk melakukan operasi point update sebanyak $r-l+1$ kali, menelusuri semua elemen yang diminta. Namun, cara ini akan memiliki kompleksitas waktu sebesar $O((r-l+1) \log \; n)$, yang besar kemungkinan tidak efisien.

Untuk mengatasi masalah ini, implementasi Fenwick Tree standar diatas tidaklah cukup. Dibutuhkan beberapa modifikasi, berupa menambahkan array bantu berupa **Difference Array**.

> [!CAUTION]
> Pelajari dulu jika belum paham apa itu *Difference Array*, karena pemahaman materi ini sangat penting untuk bisa melanjutkan sisa materi ini. Pelajari di: [Difference Array](Difference%20Array.md)
> 
> Pelajari juga pembahasan tentang *Range Update & Range Query* yang dibahas di [Fenwick Tree](Fenwick%20Tree.md) di subbab bawah. Pemahaman dasar dan gambaran besar dari operasi ini bisa dibaca dan dilihat sekilas pada materi tersebut. Hal ini sangat disarankan untuk mempermudah pemahaman dari pembahasan ini, mengingat penjelasan dibawah akan lumayan sulit dipahami

Jika kita hanya memakai *Difference Array* biasa, kita bisa melakukan *Range Update* dalam waktu $O(1)$, tapi kita tidak bisa mengecek nilai atau jumlah rentang secara *online* di tengah-tengah *query* tanpa merekonstruksi ulang array ($O(N)$).

Sebaliknya, jika kita menggunakan Fenwick Tree standar yang baru saja kita buat, kita bisa melakukan *Point Update* dan *Range Query* dalam waktu $O(\log N)$, tapi kesulitan melakukan *Range Update* secara efisien.

Lalu, bagaimana jika *Difference Array* dimasukkan ke dalam struktur Fenwick Tree?
Artinya, *array* selisih $D$ kita simpan dan kelola di dalam *nodes* Fenwick Tree!

Untuk pembahasan lengkap secara matematis dan bagaimana penurunan aljabar menghasilkan formula yang dibutuhkan, bisa mampir ke bagian [Matematika Range Update pada Fenwick Tree](Matematika%20Range%20Update%20pada%20Fenwick%20Tree.md). Karena penjelasan matematikanya sangat panjang, aku berpikir bahwa, akan jauh lebih mudah jika bagian tersebut dipisah dari penjelasan utama, agar materi ini tidak menjadi terlalu kompleks 🙂.

Oke, jika melihat ke materi [Matematika Range Update pada Fenwick Tree](Matematika%20Range%20Update%20pada%20Fenwick%20Tree.md), semua rumus dan formula yang tampak gaib, dan seperti seakan datang dari antah berantah, sebenarnya datang dari penurunan formula matematis yang ditemukan pada pola yang ada ketika kita membangun *Preffix sum* dari array yang dibuat dengan merekonstruktuksi *Difference Array*.

Secara intuitif, ketika kita melakukan *range update* pada *Difference Array*, perubahan hanya dicatat pada dua titik ($l$ dan $r+1$). Namun, ketika kita ingin menghitung total akumulasi nilai dari awal hingga titik $k$ secara *online*, rumus dasar penjumlahan elemen ke-$i$ melalui *Difference Array* ($A[i] = \sum_{j=1}^{i} D[j]$) jika diperluas untuk mencari *prefix sum* dari $1$ sampai $k$ akan menghasilkan bentuk deret berikut:

> [!TIP]
> Buka materi ini dan [Matematika Range Update pada Fenwick Tree](Matematika%20Range%20Update%20pada%20Fenwick%20Tree.md), dan lakukan perhitungan manual dengan pulpen dan kertas. Cobalah membuat *Difference Array*, lalu coba konstruksi array $A$ dibawahnya. Lalu setelah itu, cobalah membuat array *Preffix sum* dari array $A$ yang sebelumnya dibuat.
> 
> Coba perhatikan pola yang terbentuk!
> 
> Ternyata, hasil dari array *Preffix sum* bisa dibuat langsung dari *Difference array*, dengan:
> 
> $$\text{PrefixSum}(k) = \sum_{i=1}^{k} D[i] \times (k - i + 1)$$
> 
> Ini valid, dan bisa terjadi, karena saat membangun array *Preffix sum*, kita sejatinya melakukan penambahan berulang kali pada $D[i]$ sebanyak $k-i+1$, lalu mengakumulasikanya untuk mencapai *Preffix sum* ke-$k$. Ini membuat kita tidak perlu membuat array $A$ terlebih dahulu, dan bisa langsung melompat dari *Difference array* ke *Preffix sum*.


$$\text{PrefixSum}(k) = \sum_{i=1}^{k} D[i] \times (k - i + 1)$$

Jika kita bedah menggunakan sifat distributif aljabar biasa, bentuk $(k - i + 1)$ dapat dipecah menjadi dua bagian yang terpisah:

$$\text{PrefixSum}(k) = \sum_{i=1}^{k} \big( \left(D[i] \times k \right) - \left(D[i] \times i \right) + \left( D[i] \times 1 \right) \big)$$
Nilai dari $D[i] \times k$ yang ditambah dengan $D[i] \times 1$ adalah sama dengan $D[i] \times (k+1)$, sehingga kita gabungkan:

$$\text{PrefixSum}(k) = \sum_{i=1}^{k} \big( D[i] \times (k + 1) - D[i] \times i \big)$$

Karena konstanta $k + 1$ tidak bergantung pada indeks iterasi sigma $i$, kita dapat memisahkannya ke luar tanda penjumlahan, sehingga melahirkan dua suku utama:

$$\text{PrefixSum}(k) = (k + 1) \sum_{i=1}^{k} D[i] - \sum_{i=1}^{k} \big( D[i] \times i \big)$$

Dari pemisahan aljabar inilah arsitektur penyimpanan data terbelah menjadi dua komponen independen yang masing-masing bisa ditangani oleh struktur data Fenwick Tree terpisah di dalam satu kelas yang sama:

1. Komponen Pertama ($\sum_{i=1}^{k} D[i]$): Disimpan pada BIT pertama (`bit1`), yang bertugas mencatat perubahan nilai mentah *Difference Array* secara langsung ($\pm x$).
2. Komponen Kedua ($\sum_{i=1}^{k} (D[i] \times i)$): Disimpan pada BIT kedua (`bit2`), yang bertugas mencatat perubahan nilai *Difference Array* yang telah dikalikan dengan posisi indeks tempat perubahan itu terjadi ($\pm x \times \text{indeks}$).

Dengan formula di atas, sifat $D[i] \times i$ dapat langsung diterapkan pada `bit2` dengan menggunakan mekanisme penyimpanan dan pembaruan Fenwick Tree standar. Dengan cara ini, nilai akumulasi perkalian posisi yang tadinya harus dihitung satu-satu secara manual dapat langsung diambil dalam waktu $O(\log N)$ karena setiap komponen perubahannya sudah terkomputasi dan terindeks dengan rapi sejak awal *update* dilakukan.

Penerapan logika pembaruannya pun persis sama seperti saat kita mengelola *Difference Array* standar, di mana batas awal $l$ ditaruh tepat di indeksnya, sedangkan batas akhir $r$ digeser (*offset*) sebanyak satu indeks ke kanan menjadi $r + 1$ untuk menghentikan efek penyebaran nilainya. Melalui penjabaran ini, struktur kodenya terekspos secara utuh ke dalam bentuk implementasi berikut:

```cpp
void rangeAdd(int l, int r, long long val) {
// Update pada bit1 untuk mencatat perubahan Difference Array mentah
	add(bit1, l, val);
    add(bit1, r + 1, -val);

// Update pada bit2 untuk mencatat perubahan Difference Array dikali indeks
	add(bit2, l, val * l);
    add(bit2, r + 1, -val * (r + 1));
}
```

Hasil akhirnya, alih-alih terjebak dalam rumus gaib yang membingungkan, kode pembaruan rentang pada `bit2` yang tadinya tampak abstrak—seperti `add(bit2, l, val * l);` dan `add(bit2, r + 1, -val * (r + 1));`—sekarang sepenuhnya masuk akal sebagai representasi langsung dari komponen koreksi aljabar tersebut, menjadikan seluruh arsitektur *Range Update Range Query* Fenwick Tree benar dan tepat secara matematis.

Dengan memecahnya ke dalam dua *array* BIT ini, operasi *Range Update* dan *Range Query* dapat dieksekusi secara bersih dan efisien dalam kompleksitas waktu $O(\log N)$ per operasi tanpa harus melakukan iterasi penuh pada seluruh elemen rentang.

Setelah pembahasa yang cukup panjang, berikut adalah implementasinya:

```cpp
class FenwickTree {
   private:
    vector<long long> bit1;
    vector<long long> bit2;
    int n;

    void add(vector<long long>& bit, int idx, long long val) const {
        for (; idx <= n; idx += idx & -idx) {
            bit[idx] += val;
        }
    }

    static auto sum(vector<long long>& bit, int idx) -> long long {
        long long rest = 0;
        for (; idx > 0; idx -= idx & -idx) {
            rest += bit[idx];
        }

        return rest;
    }

   public:
    explicit FenwickTree(int size) {
        this->n = size;

        // penggunaan difference array mengharuskan kita
        // untuk mengatasi r+1, jadi tambahkan batas aman berupa n+2
        bit1.assign(n + 2, 0);
        bit2.assign(n + 2, 0);
    }

    // Konstruktor dari vector awal (menggunakan rangeAdd per elemen)
    explicit FenwickTree(vector<long long>& arr) : FenwickTree((int)arr.size()) {
        for (int i = 1; i <= (int)arr.size(); i++) {
            rangeAdd(i, i, arr[i - 1]);
        }
    }

    void rangeAdd(int l, int r, long long val) {
        // terapkan formula matematika disini
        add(bit1, l, val);
        add(bit1, r + 1, -val);
        add(bit2, l, val * l);
        add(bit2, r + 1, -val * (r + 1));
    }

    long long prefixSum(int k) {
        long long ans = ((k + 1) * sum(bit1, k)) - sum(bit2, k);
        return ans;
    }

    auto rangeSum(int l, int r) -> long long { 
	    return prefixSum(r) - prefixSum(l - 1); 
    }
};
```

Coba perhatikan bagian constructor dari kode diatas. Kenapa kita menggunakan fungsi `rangeAdd()` dan bukan `add()` seperti yang sudah-sudah?

Alasan kenapa konstruktor wajib menggunakan `rangeAdd(i, i, arr[i - 1])` dan bukan `add` biasa adalah karena kelas ini tidak sedang menyimpan nilai elemen mentah, melainkan sedang menyimpan **Difference Array**.

Jika kita memanggil `add` biasa (seperti pada Fenwick Tree standar), yang kita lakukan hanyalah menjejalkan nilai mentah $A[i]$ ke dalam *array*. Akibatnya, `bit1` akan berisi tumpukan nilai asli, bukan selisih antar elemen. Padahal, seluruh mahakarya rumus matematika yang baru saja kita bedah—mulai dari `bit1`, `bit2`, hingga rumus `prefixSum`—sepenuhnya dibangun di atas asumsi bahwa `bit1` dan `bit2` **hanya berisi perubahan selisih** (*difference*).

Ketika kita memanggil `rangeAdd(i, i, arr[i - 1])`, kita sedang menyuruh program untuk melakukan *range update* pada satu titik tunggal (dari indeks $i$ sampai $i$). Berdasarkan mekanisme *Difference Array*, melakukan `rangeAdd` di titik yang sama akan secara otomatis mencatat nilai $A[i]$ di posisi $i$ dan mencatat nilai $-A[i]$ di posisi $i + 1$. Inilah cara yang benar secara matematis untuk "menginisialisasi" *Difference Array* dari sebuah *array* awal. Jika kita nekat memakai `add` biasa, struktur internal kelas akan rusak total, dan fungsi `prefixSum` maupun `rangeSum` akan menghasilkan angka sampah yang sama sekali tidak nyambung.

## 4. Range Update & Point Query
Lalu bagimana dengan *Range Update & Point Query*? Sebelumnya kita sudah membahas *Range Update & Range Query*, dan itu benar-benar sangat kompleks dan panjang. Apakah kali ini akan sama kompleks dan sama panjang juga? Beruntungnya, bagian tersulit dari Fenwick Tree baru saja kita lewati, karena pada bagian ini, kompleksitasnya jauh lebih sederhana.

Dengan menggunakan trik sederhana, kita juga bisa melakukan operasi sebaliknya: menaikkan nilai pada suatu *range* (*increasing ranges*) dan melakukan *query* untuk nilai tunggal atau *single values*.

Misalkan Fenwick tree diinisialisasi dengan nilai nol. Anggaplah kita ingin menaikkan interval $[l, r]$ sebesar $x$. Kita melakukan dua operasi *point update* pada Fenwick tree, yaitu `add(l, x)` dan `add(r+1, -x)`.

Jika kita ingin mendapatkan nilai dari $A[i]$, kita hanya perlu mengambil *prefix sum* menggunakan metode *range sum* biasa. Untuk melihat mengapa ini benar, kita bisa fokus kembali pada operasi penambahan sebelumnya. Jika $i < l$, maka kedua operasi *update* tidak memberikan efek apa pun pada *query* dan kita mendapatkan jumlah $0$. Jika $i \in [l, r]$, maka kita mendapatkan jawaban $x$ karena adanya operasi *update* pertama. Dan jika $i > r$, maka operasi *update* kedua akan membatalkan efek dari operasi yang pertama.

Implementasi berikut menggunakan *one-based indexing*.

```cpp
class FenwickTree {
   private:
    vector<long long> bit;
    int n;

    void add(int idx, long long val) {
        for (; idx <= n; idx += idx & -idx) {
            bit[idx] += val;
        }
    }

    auto sum(int idx) -> long long {
        long long rest = 0;
        for (; idx > 0; idx -= idx & -idx) {
            rest += bit[idx];
        }

        return rest;
    }

   public:
    explicit FenwickTree(int size) {
        this->n = size;
        bit.assign(n + 2, 0);
    }

    explicit FenwickTree(vector<long long>& arr) : FenwickTree((int)arr.size()) {
        for (int i = 1; i <= n; i++) {
            rangeAdd(i, i, arr[i - 1]);
        }
    }

    void rangeAdd(int l, int r, long long val) {
        add(l, val);
        add(r + 1, -val);
    }

    auto getPoint(int idx) -> long long { 
        return sum(idx); 
    }
};
```

*Catatan:* Tentu saja dimungkinkan juga untuk menaikkan satu titik tunggal $A[i]$ dengan `rangeAdd(i, i, val)`.