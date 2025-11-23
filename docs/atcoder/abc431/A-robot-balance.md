Sumber: [AtCoder - abc431/A](https://atcoder.jp/contests/abc431/tasks/abc431_a)

#  A - Robot Balance

Takahashi ingin membuat robot dengan menggabungkan part kepala dan badan. Sebuah robot akan jatuh apabila berat dari kepala lebih berat daripada berat badanya sendiri.

Saat ini, dia memiliki satu part kepala dan satu part badan. Berat dari kepala adaalh $H$ gram dan berat dari badanya adalah $B$ gram.

Saat ini ia ingin membuat badannya lebih berat dari kepalanya supaya tidak jatuh. Cari tahu, berapa banyak gram berat yang perlu ditambah supaya kepalanya tidak lebih berat daripada badanya.

---

##  Sesi Death Ground ⚔️

Solusinya mudah, jika $H \leq B$, maka kita hanya perlu mengoutputkan $0$. Ini karena berat dari part sudah memnuhi kebutuhan untuk membuat robot yang tidak akan jatuh. Sedangkan jika $H > B$, maka cukup outputkan $H-B$ untuk mendapatkan berat yang perlu ditambah terhadap $B$ supaya robot yang dibuat memiliki berat part yang sesuai.

```cpp
#include<iostream>
using namespace std;

auto main() -> int {
    int h, b;
    cin >> h >> b;
    cout << (h > b ? h-b : 0);
    return 0;
}
```

---

##  Jawaban dan Editorial

Masalah ini dapat diselesaikan dengan mengimplementasikan proses berikut:

- Jika $H \leq B$, cetak $0$.
- Jika tidak, cetak $H − B$.

Proses tersebut dapat diimplementasikan menggunakan pernyataan `if`, atau dengan fungsi `max` setelah melakukan sedikit transformasi pada ekspresinya.

Berikut contoh kode.

---

### Contoh kode menggunakan `if` statement

```cpp
#include <iostream>
using namespace std;
int main() {
    int H, B;
    cin >> H >> B;
    if (H <= B) { // Jika head weight lebih kecil atau sama dengan body weight,
        cout << 0 << endl; // cetak 0
    } else { // Jika tidak,
        cout << H - B << endl; // cetak H - B
    }
    return 0;
}
```

```py
H, B = map(int, input().split())
if H <= B: # Jika head weight lebih kecil atau sama dengan body weight,
    print(0) # cetak 0
else: # Jika tidak,
    print(H - B) # cetak H - B
```

---

### Contoh kode menggunakan fungsi `max`

Proses di atas dapat dinyatakan ulang sebagai berikut:

- Cetak $B - B$ jika $H ≤ B$.
* Cetak $H - B$ jika tidak.

Dengan kata lain, tugasnya adalah:

mencetak `max(H, B) − B`.

Masalah ini dapat diselesaikan dengan menerapkan ekspresi tersebut.

```cpp
#include <iostream>
#include <algorithm>
using namespace std;
int main() {
    int H, B;
    cin >> H >> B;
    cout << max(H, B) - B << endl;
    return 0;
}
```

```py
H, B = map(int, input().split())
print(max(H, B) - B)
```

