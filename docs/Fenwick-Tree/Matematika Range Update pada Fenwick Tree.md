# Matematika Range Update pada Fenwick Tree
## Matematika dan penurunan Aljabar

> [!CAUTION]
> Pelajari dulu jika belum paham apa itu *Difference Array*, karena pemahaman materi ini sangat penting untuk bisa melanjutkan sisa materi ini. Pelajari di: [Difference Array](Difference%20Array.md)

Mari kita bedah secara matematis apa yang terjadi saat kita ingin mencari jumlah elemen dari $1$ sampai $k$ ($\text{sum}(k)$) dari sebuah *array* yang dikelola oleh *Difference Array*:

Berdasarkan definisi, nilai elemen ke-$i$ adalah:


$$A[i] = \sum_{j=1}^{i} D[j]$$

Maka, jika kita ingin mencari jumlah total dari indeks $1$ sampai $k$ ($\text{Range Sum}[1, k]$), kita tinggal menjumlahkan seluruh $A[i]$ dari $i = 1$ sampai $k$:

$$\text{PrefixSum}(k) = \sum_{i=1}^{k} A[i] = \sum_{i=1}^{k} \left( \sum_{j=1}^{i} D[j] \right)$$

Jika kita jabarkan secara manual (bayangkan bentuk segitiga penjumlahannya):

* $D[1]$ dijumlahkan sebanyak $k$ kali (dari $i=1$ sampai $k$)
* $D[2]$ dijumlahkan sebanyak $k - 1$ kali
* $D[3]$ dijumlahkan sebanyak $k - 2$ kali
* ...
* $D[i]$ dijumlahkan sebanyak $(k - i + 1)$ kali.

Maka, persamaan di atas bisa ditulis ulang menjadi:


$$\text{PrefixSum}(k) = \sum_{i=1}^{k} D[i] \times (k - i + 1)$$

Sekarang, mari kita pecah perkalian di dalam sigma tersebut menggunakan sifat distributif aljabar:


$$\text{PrefixSum}(k) = \sum_{i=1}^{k} \big( D[i] \times (k + 1) - D[i] \times i \big)$$

Pisahkan menjadi dua buah bentuk sigma yang terpisah:


$$\text{PrefixSum}(k) = (k + 1) \sum_{i=1}^{k} D[i] - \sum_{i=1}^{k} \big( D[i] \times i \big)$$


## Pembagian 2 Data

Dari penurunan aljabar terakhir kita, kita mendapatkan formula untuk mencari jumlah nilai dari indeks $1$ sampai $k$ ($\text{PrefixSum}(k)$):

$$\text{PrefixSum}(k) = (k + 1) \sum_{i=1}^{k} D[i] - \sum_{i=1}^{k} \big( D[i] \times i \big)$$

Jika kita perhatikan secara saksama, rumus tersebut memuat **dua komponen yang berbeda** dan masing-masing harus dihitung secara terpisah agar bisa dieksekusi dengan cepat:

1. **Komponen Pertama:** $\sum_{i=1}^{k} D[i]$
	Bagian ini murni menjumlahkan nilai-nilai dari *Difference Array* $D$ itu sendiri dari indeks $1$ sampai $k$. Karena ini adalah bentuk standar, kita bisa menyimpannya di dalam **Fenwick Tree Pertama** (sebut saja `bit1`).
	
2. **Komponen Kedua:** $\sum_{i=1}^{k} \big( D[i] \times i \big)$
	Bagian ini menjumlahkan perkalian antara nilai *Difference Array* $D[i]$ dengan indeks posisinya $i$. Untuk mengakomodasi perkalian dengan indeks ini, kita memerlukan **Fenwick Tree Kedua** (sebut saja `bit2`) yang bertugas menyimpan nilai $D[i] \times i$.

Dengan memecahnya menjadi dua struktur Fenwick Tree (`bit1` dan `bit2`), setiap kali kita melakukan *Range Update*, kita cukup memperbarui kedua BIT tersebut secara serentak dalam waktu $O(\log N)$.

$$(k + 1) \underbrace{\sum_{i=1}^{k} D[i]}_{\text{BIT 1}} - \underbrace{\sum_{i=1}^{k} \big( D[i] \times i \big)}_{\text{BIT 2}}$$
> [!CAUTION]
> `bit1` dan `bit2` akan dibuat menjadi berupa array 1-based-index yang berada dalam satu badan class Fenwick Tree.

## Mekanisme Operasi di Dalam Dua Fenwick Tree

### 1. Operasi *Range Update* (`rangeAdd(l, r, x)`)

Ketika kita ingin menambahkan nilai $x$ pada rentang $[l, r]$, kita tahu dari materi *Difference Array* sebelumnya bahwa perubahan hanya terjadi pada dua titik utama:

* Pada indeks $l$, kita **menambahkan** $x$ pada *Difference Array* $D$.
* Pada indeks $r + 1$, kita **mengurangi** $x$ pada *Difference Array* $D$.

Karena kita sekarang menggunakan dua *Fenwick Tree*, efek perubahan ini harus kita aplikasikan ke keduanya:

* Pada `bit1` (Menyimpan $D[i]$):
	* Di posisi $l$, tambahkan $x$ ($\rightarrow +x$).
	* Di posisi $r + 1$, kurangi $x$ ($\rightarrow -x$).


* Pada `bit2` (Menyimpan $D[i] \times i$):
	* Karena setiap elemen $D[i]$ dikalikan dengan indeksnya $i$, maka saat terjadi penambahan $x$ di indeks $l$, nilai yang masuk ke `bit2` adalah $x \times l$. Jadi, di posisi $l$, tambahkan $x \times l$.
	* Sebaliknya, saat terjadi pengurangan $x$ di indeks $r + 1$, nilai yang masuk ke `bit2` adalah $x \times (r + 1)$. Jadi, di posisi $r + 1$, kurangi $x \times (r + 1)$.


Untuk mempermudah operasi, kita bisa memodifikasi fungsi `add()` agar menerima 3 parameter, dimana parameter pertama menerima argumen berupa struktur data mana yang ingin diakses. Secara matematis, kode untuk *range update* pada kedua BIT ini akan terlihat seperti ini:

```cpp
void rangeAdd(int l, int r, long long x) {
    // Update pada bit1 untuk mencatat perubahan Difference Array
	add(bit1, l, val);
	add(bit1, r + 1, -val);

    // Update pada bit2 untuk mencatat perubahan Difference Array dikali indeks
	add(bit2, l, val * l);
    add(bit2, r + 1, -val * (r + 1));
}
```

### 2. Operasi *Prefix Sum* (`sum(k)`)

Untuk menghitung jumlah elemen dari indeks $1$ sampai $k$, kita tinggal menerjemahkan kembali rumus aljabar kita ke dalam bentuk pemanggilan kedua Fenwick Tree:

$$\text{PrefixSum}(k) = (k + 1) \times \text{sum}(bit1, \;k) - \text{sum}(bit2, \;k)$$

Di mana:

* `bit1.sum(k)` mengambil nilai akumulasi $\sum_{i=1}^{k} D[i]$
* `bit2.sum(k)` mengambil nilai akumulasi $\sum_{i=1}^{k} (D[i] \times i)$

Jika `bit1` dan `bit2` adalah struktur data yang berada dalam satu badan class Fenwick Tree, maka fungsi `sum()` bisa dimodifikasi untuk menerima 2 parameter, dimana parameter pertama digunakan untuk menunjuk struktur data mana yang ingin diproses, seperti berikut:

```cpp
// Menghitung prefix sum dari array asli dari 1 sampai k
auto prefixSum(int k) -> long long {
	return (k + 1) * sum(bit1, k) - sum(bit2, k);
}
```

### 3. Operasi *Range Query* (`rangeSum(l, r)`)

Sama seperti konsep dasar *prefix sum* yang sudah kita pelajari sebelumnya di Fenwick Tree standar, untuk mencari jumlah elemen pada rentang $[l, r]$, kita cukup memanfaatkan hasil *prefix sum* dari ujung kanan dikurangi ujung kiri sebelum $l$:

$$\text{RangeSum}(l, r) = \text{PrefixSum}(r) - \text{PrefixSum}(l - 1)$$

```cpp
auto rangeSum(int l, int r) -> long long {
    return prefixSum(r) - prefixSum(l - 1);
}
```
