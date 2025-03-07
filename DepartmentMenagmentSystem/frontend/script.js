function kaydet() {
    const isim = document.getElementById('isim').value;
    const departman = document.getElementById('departman').value;

    if (!isim || !departman) {
        alert("Lütfen tüm alanları doldurun.");
        return;
    }

    fetch("http://localhost/api/kisiler/kaydet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isim, departman })
    })
    .then(response => response.json())
    .then(data => {
        alert("Kişi başarıyla kaydedildi!");
        document.getElementById('isim').value = "";
        document.getElementById('departman').value = "";

        // Kaydedilen verileri almak için /api/app1/data'ya istek at
        return fetch('/api/app1/data');
    })
    .then(response => response.json())
    .then(data => {
        console.log("Güncellenmiş veri listesi:", data);
    })
    .catch(error => console.error("Hata:", error));
}
