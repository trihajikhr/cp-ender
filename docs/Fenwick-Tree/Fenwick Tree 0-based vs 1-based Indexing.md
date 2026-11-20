# Arsitektur dan Mekanika Fenwick Tree: Analisis Komparatif Zero-Based vs. One-Based Indexing

Dokumentasi ini dirancang sebagai referensi teknis mendalam untuk memahami perbedaan implementasi **Fenwick Tree (Binary Indexed Tree / BIT)** antara pendekatan *Zero-Based Indexing* ($0$-indexed) dan *One-Based Indexing* ($1$-indexed). Tujuannya adalah membuktikan bahwa terlepas dari perbedaan formula bitwise yang digunakan, **kedua pendekatan tersebut memiliki tujuan, struktur, dan kompleksitas waktu yang sepenuhnya identik**, di mana perbedaan tersebut murni merupakan konsekuensi dari pemetaan ruang indeks.

## 1. Fondasi Konseptual: Mengapa Indeks Memengaruhi Navigasi Bitwise

Secara konseptual, Fenwick Tree adalah struktur data *implicit tree* berbasis *array* datar di mana hubungan antara node anak (*child*) dan orang tua (*parent*) diatur oleh representasi biner dari indeksnya. Operasi bitwise yang digunakan berfungsi untuk mengekstrak *Lowest Set Bit* (LSB) atau sering disebut sebagai *lowbit*.

Inti dari permasalahan penyesuaian indeks terletak pada perilaku angka nol ($0$). Dalam sistem biner:

* Angka $1$ dan seterusnya memiliki bit $1$ yang dapat diekstrak menggunakan operasi *Two's Complement* standar (`idx & -idx`).
* Angka $0$ (`0000...0`) tidak memiliki bit $1$ sama sekali, sehingga ekspresi `0 & -0` akan selalu menghasilkan `0`.

Jika pendekatan $1$-indexed menghindari angka $0$ dengan menggeser rentang indeks menjadi $1$ sampai $N$, pendekatan $0$-indexed harus merancang ulang formula bitwise agar mampu bernavigasi secara aman di dalam rentang indeks $0$ hingga $N-1$ tanpa terjebak dalam *infinite loop* pada indeks nol.

## 2. Analisis Pendekatan One-Based Indexing (Pendekatan LSB Murni)

Pada implementasi $1$-indexed, indeks valid dimulai dari $1$ hingga $N$, sementara indeks ke-$0$ sengaja dikosongkan (`array` dialokasikan sebesar $N + 1$).

### Mekanisme Navigasi

Pendekatan ini menggunakan formula *lowbit* murni yang sangat intuitif secara matematis:

* **Operasi Update (Naik ke Parent):** `idx += (idx & -idx)`
* **Operasi Query (Turun ke Prefix):** `idx -= (idx & -idx)`

### Contoh Implementasi Modular

```cpp
#include <vector>

class Fenwick1Based {
private:
    int n;
    std::vector<long long> bit;

public:
    explicit Fenwick1Based(int size) : n(size) {
        bit.assign(n + 1, 0);
    }

    void add(int idx, long long delta) {
        // Karena input 0-based dari luar, digeser ke 1-based dengan (++idx)
        for (++idx; idx <= n; idx += (idx & -idx)) {
            bit[idx] += delta;
        }
    }

    long long query(int idx) const {
        long long total = 0;
        for (++idx; idx > 0; idx -= (idx & -idx)) {
            total += bit[idx];
        }
        return total;
    }

    long long range_sum(int l, int r) const {
        return query(r) - query(l - 1);
    }
};

```


## 3. Analisis Pendekatan Zero-Based Indexing (Standar CP-Algorithms)

Pada implementasi $0$-indexed, indeks valid berjalan dari $0$ hingga $N-1$. Untuk menghindari masalah kegagalan navigasi pada indeks nol, formula bitwise dimodifikasi secara aljabar agar memperlakukan indeks seolah-olah digeser secara internal tanpa harus mengubah alokasi memori fisik.

### Mekanisme Navigasi

Formula yang digunakan memanfaatkan manipulasi bitwise tingkat lanjut:

* **Operasi Update (Naik ke Parent):** `idx = idx | (idx + 1)`
* **Operasi Query (Turun ke Prefix):** `idx = (idx & (idx + 1)) - 1`

Trik `idx | (idx + 1)` secara cerdas menyalakan bit 1 berikutnya untuk melompat ke node di atasnya, sedangkan `(idx & (idx + 1)) - 1` membersihkan bit 1 paling kanan untuk melompat mundur ke sub-rentang sebelumnya, sekaligus menangani batas bawah secara aman saat indeks mencapai $-1$ (sebagai kondisi terminasi *loop*).

### Contoh Implementasi Modular

```cpp
#include <vector>

class Fenwick0Based {
private:
    int n;
    std::vector<long long> bit;

public:
    explicit Fenwick0Based(int size) : n(size) {
        bit.assign(n, 0);
    }

    void add(int idx, long long delta) {
        for (; idx < n; idx = idx | (idx + 1)) {
            bit[idx] += delta;
        }
    }

    long long query(int idx) const {
        long long total = 0;
        for (; idx >= 0; idx = (idx & (idx + 1)) - 1) {
            total += bit[idx];
        }
        return total;
    }

    long long range_sum(int l, int r) const {
        return query(r) - query(l - 1);
    }
};

```


## 4. Tabel Perbandingan Komparatif

Untuk menegaskan bahwa kedua pendekatan ini memiliki esensi yang sama, tabel berikut memetakan perbedaan struktur dan karakteristik operasionalnya dari sudut pandang *software engineering*:

| Parameter Komparasi    | One-Based Indexing ($1$-indexed)                                                      | Zero-Based Indexing ($0$-indexed)                                                                           |
| ---------------------- | ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Alokasi Memori**     | `vector` berukuran $N + 1$                                                            | `vector` berukuran $N$                                                                                      |
| **Formula Update**     | `idx += (idx & -idx)`                                                                 | `idx = idx \| (idx + 1)`                                                                                    |
| **Formula Query**      | `idx -= (idx & -idx)`                                                                 | `idx = (idx & (idx + 1)) - 1`                                                                               |
| **Kondisi Terminasi**  | `idx <= n` dan `idx > 0`                                                              | `idx < n` dan `idx >= 0`                                                                                    |
| **Kelebihan**          | Formula LSB (`& -idx`) sangat transparan dan mudah diturunkan secara matematis.       | Selaras langsung dengan standar *array* C++ (`std::vector`), tanpa perlu penyesuaian indeks parameter luar. |
| **Kekurangan**         | Membutuhkan pergeseran indeks manual (`++idx`) saat berinteraksi dengan data standar. | Formula bitwise terlihat lebih abstrak dan kurang intuitif bagi pemula.                                     |
| **Kompleksitas Waktu** | $O(\log N)$ per operasi                                                               | $O(\log N)$ per operasi                                                                                     |
| **Kompleksitas Ruang** | $O(N)$                                                                                | $O(N)$                                                                                                      |



## 5. Kesimpulan Arsitektural

Perbedaan formula antara kode $1$-indexed (`i & -i`) dan $0$-indexed (`r & (r + 1)`) **bukanlah indikasi adanya perbedaan tujuan fungsional**. Keduanya sama-sama membangun struktur pohon biner implisit untuk merangkum rentang data dalam kompleksitas logaritmik.

Pemilihan di antara keduanya bergantung pada preferensi *workflow* pengembangan: gunakan pendekatan $1$-indexed jika Anda ingin memahami mekanika LSB secara transparan, atau gunakan pendekatan $0$-indexed jika Anda ingin integrasi langsung yang mulus dengan struktur data standar berbasis nol di C++.