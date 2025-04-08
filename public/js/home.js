document.addEventListener("DOMContentLoaded", function () {
  const featuredCourses = [
    {
      id: 1,
      title: "Lập trình Java cơ bản",
      description: "Học từ A đến Z về Java với ví dụ thực tế.",
      image: "/images/java.png"  // ← đúng đường dẫn
    },
    {
      id: 2,
      title: "Thiết kế Web hiện đại với HTML/CSS",
      description: "Xây dựng giao diện web đẹp và chuẩn responsive.",
      image: "/images/htmlcss.png"
    },
    {
      id: 3,
      title: "Phân tích dữ liệu với Python",
      description: "Khám phá dữ liệu cùng Python và thư viện Pandas.",
      image: "/images/python.jpg"
    }
  ];

  const featuredContainer = document.getElementById("featuredCourses");
  featuredCourses.forEach(course => {
    const col = document.createElement("div");
    col.className = "col";
    col.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="${course.image}" class="card-img-top" alt="${course.title}">
        <div class="card-body">
          <h5 class="card-title">${course.title}</h5>
          <p class="card-text">${course.description}</p>
          <a href="/courses/${course.id}" class="btn btn-primary">Xem chi tiết</a>
        </div>
      </div>
    `;
    featuredContainer.appendChild(col);
  });
});
