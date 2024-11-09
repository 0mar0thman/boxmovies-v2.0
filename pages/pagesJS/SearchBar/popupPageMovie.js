
// عناصر التحكم
const searchInput = document.getElementById('searchInput3');
const popup = document.getElementById('popup3');
const closePopup = document.getElementById('close-popup3');
const searchResults = document.getElementById('search-results3');
const searchInputInsidePageMovie = document.getElementById('searchInputInsidePageMovie');

// إظهار النافذة المنبثقة عند الكتابة
searchInput.addEventListener('input', function () {
  const query = searchInput.value.trim();

  if (query) {
    // عرض البوباب
    popup.style.display = 'block';

    // عرض النتائج (تحديث البيانات بناءً على النص المدخل)
    searchResults.innerHTML = `أنت تبحث عن: ${query}`;
    // هنا يمكنك استخدام منطق البحث الخاص بك وجلب البيانات من API أو قاعدة بيانات
  } else {
    // إخفاء البوباب إذا كان الحقل فارغًا
    popup.style.display = 'none';
  }
});

// إغلاق النافذة المنبثقة عند النقر على ×
closePopup.addEventListener('click', function () {
  popup.style.display = 'none';
});

// إخفاء النافذة إذا ضغط المستخدم في أي مكان خارجها
window.addEventListener('click', function (event) {
  if (event.target == popup) {
    popup.style.display = 'none';
  } 
});

function copy() {
  searchInput.addEventListener('input', function() {

    searchInputInsidePageMovie.value = this.value
  })
 }
 copy()