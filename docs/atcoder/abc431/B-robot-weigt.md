Sumber: [AtCoder - abc431/B](https://atcoder.jp/contests/abc431/tasks/abc431_b)

# B - Robot Weight

Terdapat robot, yang awalnya memiliki berat $X$. Robot ini memiliki $N$ part yang dapat dipasang secara simulatan sebanyak $N$ tipe. Bobot dari setiap $N_i$ part adalah adalah $W_i$. Pada awalnya, tidak ada part yang terpasang.

Akan dilakukan proses sebanyak $Q$ query. Dimana $Q_i$ merepresentasikan:
- Jika part ke $Q_i$ tidak terpasang, maka lakukan pemasangan. Tapi jika sudah dipasang, maka lepas part tersebut.

Tentukan berat robot setealh melakukan semua query tersebut.

---

##  Sesi Death Ground ⚔️

Menurutku solusinya mudah, kita hanya perlu menandai setiap part sebagai sudah diambil atau belum, dengan menyimpan berat dari setiap part dengan status boolean, misal dengan menggunakan vector + pair.

Gunakan array 1-based index, dan gunakan $Q_i$ sebagai pengakses part. Jika part terpasng, maka lepas, dan kurangi berat. Jika tidak terpasang, maka lakukan pemasangan, dan tambah beratnya.

```cpp
#include<iostream>
#include<vector>
using namespace std;

auto main() -> int {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int sum;
    cin >> sum;
    int n;
    cin >> n;
    vector<pair<int, int>> at(n+1);
    for (int i=1; i<=n; i++) {
        cin >> at[i].first;
        at[i].second = 0;
    }

    int q;
    cin >> q;
    while (q--) {
        int y;
        cin >> y;
        if (at[y].second) {
            sum -= at[y].first;
            cout << sum << '\n';
            at[y].second = 0;
        } else {
            sum += at[y].first;
            at[y].second = 1;
            cout << sum << '\n';
        }
    }
    return 0;
}
```

---

## Jawaban dan Editorial

Jika kita dapat mengelola status setiap jenis bagian apakah terpasang pada robot atau tidak, maka kita dapat memproses setiap query dengan memperbarui informasi tersebut sambil menghitung total berat berdasarkan informasi itu.

Untuk mengelola $N$ buah status berupa “terpasang/tidak terpasang,” kita dapat menggunakan fitur bahasa pemrograman seperti array atau list.

Berikut ini adalah contoh kode programnya.

```cpp
#include <iostream>
#include <vector>

int main() {
    using namespace std;
    int X, N;
    cin >> X >> N;
    vector<int> W(N);
    for (auto&& w : W)
        cin >> w;
    vector<bool> b(N); // b[i] := true if part i is attached; false otherwise

    int Q;
    cin >> Q;
    for (int q = 0; q < Q; ++q) {
        int P;
        cin >> P;
        --P;
        if (b[P]) { // If attached,
            b[P] = false; // detach it
        } else { // If detached
            b[P] = true; // attach it
        }

        // Find the weight
        int weight = X;
        for (int i = 0; i < N; ++i) {
            if (b[i]) { // If part i is attached,
                weight += W[i]; // add the weight
            }
        }
        cout << weight << endl;
        // Or one may `#include <numeric>` and write:
        // cout << transform_reduce(begin(W), end(W), begin(b), X) << endl;
    }
    return 0;
}
```
