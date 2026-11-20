
# Representasi Bilangan Negatif: Menguasai Konsep Two's Complement dan Operasi Bitwise Low-Level

Dalam ranah _competitive programming_, efisiensi eksekusi kode dan pemahaman mendalam terhadap arsitektur komputer sering kali menjadi penentu utama antara solusi yang diterima (_Accepted_) atau mengalami batas waktu (_Time Limit Exceeded_). Salah satu konsep fundamental yang wajib dikuasai adalah bagaimana komputer memproses dan menyimpan bilangan bulat negatif di dalam memori. Berbeda dengan manusia yang menggunakan tanda minus (-), komputer memanfaatkan sistem representasi biner khusus yang dikenal sebagai **Two's Complement** (Komplemen Dua). Pemahaman terhadap konsep ini tidak hanya membantu dalam menghindari kesalahan batas bawah data (_integer underflow_), tetapi juga membuka peluang pemanfaatan trik bitwise tingkat tinggi untuk mempercepat algoritma.

## Mekanisme Dasar Two's Complement

Sistem _Two's Complement_ dipilih oleh perancang arsitektur komputer karena efisiensinya dalam menyatukan sirkuit penjumlahan dan pengurangan. Melalui sistem ini, operasi pengurangan antara dua bilangan $(A - B)$ dapat dieksekusi secara matematis sebagai operasi penjumlahan biasa, yaitu $(A + (-B))$. Untuk mengubah suatu bilangan bulat positif menjadi representasi negatifnya dalam biner, komputer secara internal selalu melewati dua tahapan mutlak secara berurutan.

1. Langkah pertama yang dilakukan komputer adalah membalikkan status setiap bit dari bilangan positif tersebut melalui operasi bitwise NOT atau inversi. Proses ini, yang juga sering disebut sebagai _One's Complement_, mengubah seluruh bit bernilai `0` menjadi `1`, dan sebaliknya, seluruh bit bernilai `1` menjadi `0`. 
2. Setelah proses pembalikan bit selesai, komputer akan melanjutkan ke langkah kedua, yaitu menambahkan nilai `1` pada bit paling kanan atau _Least Significant Bit_ (LSB) dari hasil inversi tersebut. Gabungan dari proses inversi dan penambahan satu inilah yang secara baku menghasilkan representasi _Two's Complement_ yang valid.

> [!NOTE]
> Two's Complement = **Invert (Flip) + 1**

Sebagai contoh konkret dalam format biner 8-bit, kita dapat melihat perubahan angka positif `15` menjadi `-15`. Bilangan desimal `15` memiliki representasi biner `00001111`. Ketika komputer mengeksekusi langkah pertama (inversi bit), bentuk binernya berubah secara menyeluruh menjadi `11110000`. Memasuki langkah kedua, komputer menambahkan angka `1` pada bit terakhir sehingga menghasilkan bentuk biner akhir `11110001`. Representasi inilah yang dibaca oleh sistem komputer sebagai nilai `-15`.

### Contoh

#### Simulasi 1: Konversi Angka 20 menjadi -20 (Format 8-Bit)

Bilangan desimal `20` memiliki representasi biner asli yaitu `00010100`. Untuk mengubahnya menjadi bilangan negatif `-20`, komputer melakukan dua tahapan proses berikut:

1. **Tahap Inversi (Bitwise NOT):** Mengubah seluruh bit `0` menjadi `1` dan bit `1` menjadi `0`.  
    $(\text{20\ (Positif)}=00010100\xrightarrow{\text{Inversi}}11101011)$
2. **Tahap Penambahan Satu:** Menambahkan nilai `1` pada bit paling kanan (_Least Significant Bit_) dari hasil inversi tersebut.  
    $(\begin{array}{rcc}&\mathbf{11101011}&\text{(Hasil\ Inversi)}\\ +&\mathbf{00000001}&\text{(Ditambah\ 1)}\\ \hline =&\mathbf{11101100}&\implies \text{Representasi\ dari\ -20}\end{array})$

#### Simulasi 2: Konversi Angka 14 menjadi -14 (Format 8-Bit)

Bilangan desimal `14` memiliki representasi biner asli yaitu `00001110`. Berikut adalah proses perubahan internalnya untuk menghasilkan bilangan negatif `-14`:

1. **Tahap Inversi (Bitwise NOT):** Membalikkan status status setiap bit secara menyeluruh.  
    $(\text{14\ (Positif)}=00001110\xrightarrow{\text{Inversi}}11110001)$
2. **Tahap Penambahan Satu:** Menambahkan nilai `1` pada hasil inversi. Proses ini memicu efek domino penjumlahan biner pada dua bit terakhir (1 + 1 = 0, simpan 1).  
    $(\begin{array}{rcc}&\mathbf{11110001}&\text{(Hasil\ Inversi)}\\ +&\mathbf{00000001}&\text{(Ditambah\ 1)}\\ \hline =&\mathbf{11110010}&\implies \text{Representasi\ dari\ -14}\end{array})$



## Metode Cepat (_Shortcut_) untuk Analisis Manual

Melakukan perhitungan _Two's Complement_ dengan metode baku secara manual sering kali memakan waktu saat melakukan pelacakan kode (_debugging_) di tengah kompetisi. Oleh karena itu, terdapat sebuah trik cepat yang didasarkan pada karakteristik matematis sistem biner untuk mendapatkan hasil yang sama tanpa perlu melakukan operasi penjumlahan. Trik ini berfokus pada pemindaian bit dari arah kanan ke kiri.

Prosedur pemindaian manual ini dilakukan dengan cara melihat representasi biner dari bilangan positif asli, dimulai dari bit paling kanan menuju ke kiri. Aturannya adalah membiarkan semua bit bernilai `0` dan bit `1` pertama yang Anda temui tetap sama tanpa ada perubahan. Namun, tepat setelah bit `1` pertama tersebut terlewati, Anda harus membalikkan seluruh sisa bit yang berada di sebelah kirinya secara total.

Jika kita menguji trik ini pada angka `16` yang memiliki biner `00010000`, pemindaian dari kanan akan melewati empat angka `0` dan berhenti tepat pada angka `1` di urutan kelima. Bagian kanan ini (`10000`) dipertahankan nilainya. Selanjutnya, tiga bit `0` yang tersisa di sisi paling kiri langsung dibalik menjadi `111`. Hasil instan yang didapatkan adalah `11110000`, yang terbukti valid sebagai representasi biner dari `-16`.

## Pemanfaatan dalam Operasi Bitwise AND (`x & -x`)

Salah satu implementasi paling populer dari pemahaman _Two's Complement_ dalam dunia _competitive programming_ adalah operasi bitwise AND antara sebuah variabel dengan nilai negatifnya sendiri, yang umum ditulis dengan notasi `x & -x`. Operasi ini memegang peranan krusial karena memiliki sifat matematis untuk mengisolasi atau mengekstrak bit bernilai `1` yang letaknya paling kanan (_Lowest Set Bit_) dari sebuah bilangan desimal, sekaligus mengubah bit-bit lainnya menjadi `0`.

Sifat unik ini tercipta sebagai dampak langsung dari mekanisme _Two's Complement_. Ketika suatu bilangan diinversi dan ditambah `1`, bit `1` pertama dari kanan pada bilangan negatif akan selalu berada di posisi yang persis sama dengan bilangan positif aslinya. Sementara itu, semua bit di sebelah kiri posisi tersebut dipastikan memiliki nilai yang berlawanan antara kedua bilangan. Saat operasi bitwise AND (`&`) mempertemukan keduanya, bagian kiri yang berlawanan akan menghasilkan `0`, sedangkan bagian kanan yang memiliki kecocokan angka `1` akan tetap bertahan.

Kemampuan melakukan ekstraksi bit dalam kompleksitas waktu $(O(1))$ ini menjadi fondasi utama dalam optimalisasi berbagai struktur data tingkat lanjut. Salah satu contoh yang paling sering dijumpai adalah implementasi _Fenwick Tree_ atau _Binary Indexed Tree_ (BIT). Struktur data tersebut sangat bergantung pada operasi `x & -x` untuk melakukan navigasi indeks pohon biner secara cepat saat mengeksekusi fungsi pembaruan nilai (_update query_) maupun kalkulasi jumlah jangkauan (_prefix sum query_).