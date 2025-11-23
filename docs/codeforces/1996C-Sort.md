---
obsidianUIMode: preview
note_type: Death Ground ☠️
kode_soal: 1996C
judul_DEATH: Sort
teori_DEATH:
sumber:
  - codeforces.com
rating: 1200
ada_tips:
date_learned: 2025-11-23T13:34:00
tags:
  - dynamic-programming
  - greedy
  - sortings
  - string
---
Sumber: [Problem - 1996C - Codeforces](https://codeforces.com/problemset/problem/1996/C)

```ad-tip
title:⚔️ Teori Death Ground
```

<br/>

---
# 1 | Sort


**Batas waktu per uji:** 5 detik
**Batas memori per uji:** 256 megabyte

Anda diberikan dua string $a$ dan $b$ yang masing-masing memiliki panjang $n$. Setelah itu, Anda harus menjawab $q$ buah query.

Untuk setiap query, diberikan sebuah rentang indeks dari $l$ hingga $r$. Dalam satu operasi, Anda dapat memilih sebuah indeks $i$ dengan $l \le i \le r$ dan mengubah $a_i = x$, di mana $x$ adalah karakter apa pun yang Anda inginkan.

Tujuan Anda adalah menentukan jumlah minimum operasi yang harus dilakukan sehingga:

$$\text{sorted}(a[l..r]) = \text{sorted}(b[l..r])$$

Operasi yang dilakukan pada satu query tidak mempengaruhi query lainnya.

Untuk sebuah string sembarang $c$, $\text{sorted}(c[l..r])$ adalah substring $c_l, c_{l+1}, \ldots, c_r$ yang telah diurutkan secara leksikografis.

**Input**

Baris pertama berisi sebuah bilangan bulat $t$ ($1 \le t \le 1000$) — jumlah test case.

Untuk setiap test case:

* Baris pertama berisi dua bilangan bulat $n$ dan $q$ ($1 \le n, q \le 2 \cdot 10^5$).
* Baris berikutnya berisi string $a$ sepanjang $n$ (hanya huruf latin kecil).
* Baris berikutnya berisi string $b$ sepanjang $n$ (hanya huruf latin kecil).
* Setiap dari $q$ baris berikutnya berisi dua bilangan bulat $l$ dan $r$ ($1 \le l \le r \le n$) — rentang query.

Dijamin bahwa total nilai $n$ dan $q$ pada seluruh test case tidak melebihi $2 \cdot 10^5$.

**Output**

Untuk setiap query, keluarkan satu bilangan bulat — jumlah minimum operasi yang diperlukan.

**Input Output**

```
3
5 3
abcde
edcba
1 5
1 4
3 3

4 2
zzde
azbe
1 3
1 4

6 3
uwuwuw
wuwuwu
2 4
1 3
1 6
```

```
0
1
0
2
2
1
1
0
```

<br/>

---
# 2 | Sesi Death Ground ⚔️

<br/>

---


# 3 | Jawaban dan Editorial

## 3.1 | Analisis Official

Agar dua string menjadi sama setelah diurutkan, keduanya harus memiliki jumlah kemunculan yang sama untuk setiap huruf alfabet kecil. Untuk menjawab query pada rentang $[l, r]$, kita harus memastikan bahwa setelah operasi:

$$\text{cnt}_c = \text{cnt2}_c$$

di mana $\text{cnt}_c$ adalah jumlah kemunculan karakter $c$ pada substring $a[l..r]$, dan $\text{cnt2}_c$ adalah jumlah kemunculan karakter yang sama pada substring $b[l..r]$.

Baik $\text{cnt}_c$ maupun $\text{cnt2}_c$ dapat dihitung menggunakan prefix sum untuk karakter $c$. Karena hanya ada $26$ kemungkinan karakter, maka kita dapat membuat $26$ buah array prefix sum masing-masing berukuran $n$.

Dalam satu operasi, Anda dapat mengganti satu karakter $c$ menjadi karakter lain $c_2$. Secara konsep, operasi tersebut berarti mengurangi:

$$\text{cnt}_c \leftarrow \text{cnt}_c - 1$$

dan menambah:

$$\text{cnt}*{c_2} \leftarrow \text{cnt}*{c_2} + 1$$

Tentu saja, karakter yang dipilih harus memenuhi kondisi:

$$\text{cnt}_c > \text{cnt2}_c
\quad \text{dan} \quad
\text{cnt}_{c_2} < \text{cnt2}_{c_2}$$

Sehingga, kita hanya perlu fokus pada karakter $c$ (atau $c_2$) karena setiap pengurangan pada satu karakter otomatis meningkatkan karakter lainnya.

Jawaban untuk query adalah:

$$\sum_{c='a'}^{'z'} \max(0,, \text{cnt}_c - \text{cnt2}_c)$$

yakni jumlah seluruh selisih surplus karakter di string $a$ dibandingkan string $b$ pada rentang tersebut.

## 3.2 | Analisis Pribadi
## 3.3 | Analisis Jawaban User Lain

### 1 | Jawaban Pertama

```cpp
```
### 2 | Jawaban Kedua

```cpp
```
### 3 | Jawaban Ketiga

```cpp
```