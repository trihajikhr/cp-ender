---
obsidianUIMode: preview
note_type: Death Ground ☠️
kode_soal: 1559C
judul_DEATH: Mocha and Hiking
teori_DEATH:
sumber:
  - codeforces.com
rating: 1200
ada_tips:
date_learned: 2025-11-23T13:15:00
tags:
  - constructive-algorithms
  - graphs
---
Sumber: [Problem - 1559C - Codeforces](https://codeforces.com/problemset/problem/1559/C)

```ad-tip
title:⚔️ Teori Death Ground
```

<br/>

---
# 1 | Mocha and Hiking

Kota tempat Mocha tinggal bernama Zhijiang. Di kota tersebut terdapat $n+1$ desa dan $2n−1$ jalan satu arah.

Terdapat dua jenis jalan:

1. Sebanyak $n−1$ jalan menghubungkan desa $i$ ke desa $i+1$, untuk setiap $1≤i≤n−1$.
    
2. Sebanyak $n$ jalan lain dijelaskan menggunakan suatu deret $a1,…,an$.  Jika $a_i=0$, maka jalan ke-$i$ menghubungkan desa $i$ ke desa $n+1$. Jika $a_i=1$, maka jalan tersebut menghubungkan desa $n+1$ ke desa $i$.

Mocha berencana pergi hiking bersama Taki akhir pekan ini. Agar perjalanan tidak membosankan, mereka ingin melalui setiap desa tepat satu kali. Mereka boleh memulai dan mengakhiri di desa mana pun. Bisakah kamu membantu mereka menentukan rute perjalanan tersebut?

**Input**

Setiap input terdiri dari beberapa test case.

Baris pertama berisi sebuah bilangan bulat $t$ $(1≤t≤20)$ — banyaknya test case.  
Setiap test case terdiri dari dua baris:

Baris pertama berisi sebuah integer $n (1≤n≤10^4)$ — menandakan bahwa jumlah desa adalah $n+1$.

Baris kedua berisi $n$ bilangan: $a_1,a_2,…,a_n (0≤a_i≤1)$. Jika $a_i=0$, berarti terdapat jalan dari desa $i$ menuju desa $n+1$. Jika $a_i=1$, berarti terdapat jalan dari desa $n+1$ menuju desa $i$.

Dijamin bahwa jumlah seluruh $n$ pada semua test case tidak melebihi $10^4$.

**Output**

Untuk setiap test case, cetak satu baris berisi $n+1$ bilangan, di mana bilangan ke-$i$ menunjukkan desa yang dikunjungi pada urutan ke-$i$.

Jika tidak ada rute yang valid, cetak $-1$.

Jika terdapat lebih dari satu jawaban yang benar, boleh mencetak salah satunya.

<br/>

---
# 2 | Sesi Death Ground ⚔️

Aku tidak tahu bagaimana cara menyelesaikanya, mari kita bedah.

<br/>

---


# 3 | Jawaban dan Editorial

## 3.1 | Analisis Official

Jika $a_1 = 1$, maka lintasan $\left[(n+1) \to 1 \to 2 \to \cdots \to n \right]$ valid.

Jika $a_n = 0$, maka lintasan $\left[1 \to 2 \to \cdots \to n \to (n+1)\right]$ valid.

Jika bukan keduanya, karena $a_1 = 0 \land a_n = 1$, maka pasti terdapat sebuah bilangan bulat $i$ dengan $1 \le i < n$ sehingga $a_i = 0 \land a_{i+1} = 1$. Pada kasus ini, lintasan:

$$\left[1 \to 2 \to \cdots \to i \to (n+1) \to (i+1) \to (i+2) \to \cdots \to n \right]$$

adalah valid.

Ini merupakan langkah untuk membuktikan bahwa selalu ada sebuah **lintasan Hamiltonian** di dalam sebuah **tournament graph**.

Editorial:

```cpp
#include <bits/stdc++.h>
using namespace std;

void solve() {
    int n;
    cin >> n;

    vector<int> a(n);
    for(int i = 0; i < n; i++){
        cin >> a[i];
    }

    // Case 1: a1 = 1 → path: (n+1) → 1 → 2 → ... → n
    if(a[0] == 1){
        cout << n + 1 << " ";
        for(int i = 1; i <= n; i++){
            cout << i << " ";
        }
        return;
    }

    // Case 2: find position where ai = 0 and ai+1 = 1
    for(int i = 0; i < n - 1; i++){
        if(a[i] == 0 && a[i + 1] == 1){
            for(int j = 1; j <= i + 1; j++){
                cout << j << " ";
            }
            cout << n + 1 << " ";
            for(int j = i + 2; j <= n; j++){
                cout << j << " ";
            }
            return;
        }
    }

    // Case 3: an = 0 → path: 1 → 2 → ... → n → (n+1)
    for(int i = 1; i <= n; i++){
        cout << i << " ";
    }
    cout << n + 1 << " ";
}

int main(){
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int t;
    cin >> t;
    while(t--){
        solve();
        cout << "\n";
    }
    return 0;
}
```

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