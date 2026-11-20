# Difference Array (Array Selisih)

## 1. Motivasi dan Permasalahan Dasar (*Problem Statement*)

Diberikan sebuah *array* $A$ yang berisi $N$ elemen, yang awalnya bernilai nol seluruhnya. Anda diberikan $Q$ buah *operasi pembaruan* (*update operations*). Pada setiap operasi, Anda diminta untuk menambahkan suatu nilai $X$ ke seluruh elemen dalam rentang indeks $[l, r]$ secara inklusif. Setelah seluruh operasi selesai, Anda diminta untuk mencetak isi akhir dari *array* $A$.

### Pendekatan Naif (*Brute Force*)

Pendekatan paling intuitif adalah melakukan iterasi pada setiap elemen di dalam rentang yang diminta pada setiap *query*:

```cpp
void update(int l, int r, long long x, vector<long long>& a) {
    for (int i = l; i <= r; i++) {
        a[i] += x;
    }
}
```

* **Analisis Kompleksitas:** Jika panjang rentang rata-rata adalah $O(N)$ dan terdapat $Q$ *query*, maka total kompleksitas waktu di kasus terburuk (*worst-case*) adalah $O(N \times Q)$.
* **Evaluasi:** Untuk batasan soal standar *competitive programming* ($N, Q \le 10^5$), pendekatan ini akan menghasilkan waktu eksekusi yang masif dan berujung pada **Time Limit Exceeded (TLE)**. Kita membutuhkan struktur atau teknik yang mampu mengeksekusi *range update* dalam waktu yang jauh lebih efisien.

## 2. Definisi Matematis dan Konstruksi Dasar

Alih-alih memodifikasi setiap elemen secara langsung di dalam rentang $[l, r]$, kita dapat memanfaatkan konsep kalkulus diskrit, yaitu **Difference Array** (biasanya dinotasikan sebagai $D$).

Definisi formal dari *Difference Array* $D$ untuk sebuah *array* $A$ berukuran $N$ (dengan asumsi 1-based indexing) adalah:

$$D[i] = \begin{cases} A[1] & \text{jika } i = 1 \\  A[i] - A[i-1] & \text{jika } 1 < i \le N \\ 0 & \text{jika } i = N + 1 \end{cases}$$

Dari definisi di atas, sifat mendasar yang harus dicatat adalah:

> Nilai dari suatu elemen $A[i]$ pada *array* asli merupakan hasil penjumlahan prefiks (*prefix sum*) dari *array* selisih $D$ dari indeks $1$ hingga $i$:
> 
> $$A[i] = \sum_{j=1}^{i} D[j]$$
> 
> 

## 3. Mekanisme Operasi *Range Update*

Keunggulan utama dari *Difference Array* terletak pada bagaimana ia merepresentasikan perubahan rentang. Jika kita ingin menambahkan nilai $X$ pada rentang $[l, r]$, kita tidak perlu menyentuh seluruh elemen di dalam rentang tersebut. Kita hanya perlu melakukan dua operasi modifikasi titik (*point update*):

1. **Titik Awal ($l$):** Tambahkan $X$ pada $D[l]$
	
	$$D[l] \mathrel{+}= X$$
	
	
	
	*Interpretasi:* Penambahan ini memberikan efek kumulatif positif sebesar $X$ yang akan terbawa ke seluruh elemen di sebelah kanan indeks $l$ ketika proses *prefix sum* dilakukan.

1. **Titik Setelah Akhir ($r + 1$):** Kurangi $X$ pada $D[r + 1]$
	
	$$D[r + 1] \mathrel{-}= X$$
	
	
	
	*Interpretasi:* Pengurangan ini berfungsi sebagai "rem" atau penetral. Tepat pada indeks $r + 1$ dan seterusnya, akumulasi penambahan $X$ dihentikan agar efek penambahan tidak mencemari elemen di luar batas rentang $r$.

### Ilustrasi Aljabar

Misalkan kita memiliki *array* kosong berukuran $5$: $A = [0, 0, 0, 0, 0]$ dan $D = [0, 0, 0, 0, 0, 0]$.
Kita ingin menerapkan *query*: **tambahkan nilai $3$ pada rentang $[2, 4]$**.

Berdasarkan aturan di atas:

* $l = 2 \implies D[2] \mathrel{+}= 3$
* $r = 4 \implies r + 1 = 5 \implies D[5] \mathrel{-}= 3$

Hasil *array* $D$ setelah *query*:


$$D = [0, 3, 0, 0, -3, 0]$$

Ketika kita merekonstruksi kembali *array* $A$ melalui *prefix sum* ($A[i] = \sum_{j=1}^{i} D[j]$):

* $A[1] = 0$
* $A[2] = 0 + 3 = 3$
* $A[3] = 3 + 0 = 3$
* $A[4] = 3 + 0 = 3$
* $A[5] = 3 + (-3) = 0$

Hasil akhir *array* $A$ menjadi $[0, 3, 3, 3, 0]$. Rentang $[2, 4$] sukses bertambah sebesar $3$ secara serentak hanya dengan **dua operasi dasar berbiaya $O(1)$**.

## 4. Implementasi Kode Standar (*Production-Ready*)

Berikut adalah implementasi bersih dalam C++ modern untuk mengelola *Difference Array* secara efisien:

```cpp
#include <iostream>
#include <vector>

using namespace std;

class DifferenceArray {
private:
    int n;
    vector<long long> diff;

public:
    // Konstruktor menginisialisasi ukuran array
    explicit DifferenceArray(int size) {
        this->n = size;
        // Ukuran n + 2 disiapkan untuk keamanan akses indeks r + 1
        diff.assign(n + 2, 0);
    }

    // Melakukan range update dalam O(1)
    void rangeAdd(int l, int r, long long x) {
        diff[l] += x;
        diff[r + 1] -= x;
    }

    // Merekonstruksi array akhir melalui prefix sum dalam O(N)
    auto buildResultArray() -> vector<long long> {
        vector<long long> result(n + 1, 0);
        long long current_sum = 0;
        
        for (int i = 1; i <= n; i++) {
            current_sum += diff[i];
            result[i] = current_sum;
        }
        
        return result;
    }
};

auto main() -> int {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n, q;
    if (!(cin >> n >> q)) return 0;

    DifferenceArray diffArr(n);

    // Memproses Q query range update
    while (q--) {
        int l, r;
        long long x;
        cin >> l >> r >> x;
        diffArr.rangeAdd(l, r, x);
    }

    // Mendapatkan hasil akhir array
    vector<long long> final_arr = diffArr.buildResultArray();

    // Mencetak hasil (1-based index)
    for (int i = 1; i <= n; i++) {
        cout << final_arr[i] << (i == n ? "" : " ");
    }
    cout << "\n";

    return 0;
}

```


## 5. Analisis Kompleksitas & Batasan

* **Time Complexity**:
	* Setiap operasi *range update* memerlukan tepat 2 modifikasi memori $\rightarrow$ $O(1)$ per query.
	* Proses rekonstruksi akhir (*prefix sum*) berjalan satu kali di akhir program $\rightarrow$ **$O(N)$**.
	* Total kompleksitas waktu keseluruhan adalah **$O(N + Q)$**, yang sangat optimal untuk menyelesaikan persoalan berskala besar.

* **Space Complexity**:
	* Membutuhkan *array* tambahan berukuran $N + 2$ untuk menyimpan nilai selisih $\rightarrow$ **$O(N)$**.


## 6. Catatan Kritis

1. **Sifat Operasi:** *Difference Array* dasar yang dibahas di atas bersifat **offline**. Artinya, teknik ini sangat ideal jika seluruh *query* pembaruan dikumpulkan terlebih dahulu, dan nilai akhir *array* baru dihitung di akhir.
2. **Keterbatasan *Query* Interaktif:** Jika soal menuntut Anda untuk membaca hasil nilai elemen *di tengah-tengah* berjalannya *query update* (secara online), maka *Difference Array* statis tidak dapat langsung digunakan secara efisien tanpa struktur data tambahan. Di sinilah nantinya konsep **Fenwick Tree yang digabungkan dengan Difference Array** diperlukan untuk menangani *Range Update dan Range Query secara bersamaan*.