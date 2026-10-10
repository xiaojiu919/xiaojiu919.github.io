(() => {
  const books = window.BOOKS || [];
  const categories = ["全部", ...new Set(books.map((book) => book.category))];
  const filters = document.getElementById("filter-buttons");
  const list = document.getElementById("book-grid");
  const search = document.getElementById("book-search");
  const count = document.getElementById("result-count");
  const empty = document.getElementById("empty-state");
  let activeCategory = "全部";

  categories.forEach((category, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `filter-button${index === 0 ? " is-active" : ""}`;
    button.textContent = category;
    button.setAttribute("aria-pressed", String(index === 0));
    button.addEventListener("click", () => {
      activeCategory = category;
      filters.querySelectorAll("button").forEach((item) => {
        const selected = item === button;
        item.classList.toggle("is-active", selected);
        item.setAttribute("aria-pressed", String(selected));
      });
      render();
    });
    filters.append(button);
  });

  function render() {
    const term = search.value.trim().toLocaleLowerCase("zh-CN");
    const visibleBooks = books.filter((book) => {
      const categoryMatches = activeCategory === "全部" || book.category === activeCategory;
      const searchMatches = !term || `${book.title} ${book.subtitle} ${book.author} ${book.note}`.toLocaleLowerCase("zh-CN").includes(term);
      return categoryMatches && searchMatches;
    });
    list.replaceChildren();

    visibleBooks.forEach((book) => {
      const bookIndex = books.indexOf(book);
      const article = document.createElement("article");
      article.className = `book-spread spread-${bookIndex % 4}`;
      article.style.setProperty("--spread-index", bookIndex);

      const visual = document.createElement("div");
      visual.className = "book-visual";
      const image = document.createElement("img");
      image.src = book.image;
      image.alt = `${book.title} 的书封与手写阅读记录`;
      image.loading = "lazy";
      const serial = document.createElement("span");
      serial.className = "book-serial";
      serial.textContent = String(bookIndex + 1).padStart(2, "0");
      const category = document.createElement("span");
      category.className = "cover-category";
      category.textContent = book.category;
      visual.append(image, serial, category);

      const copy = document.createElement("div");
      copy.className = "book-copy";
      const date = document.createElement("p");
      date.className = "book-date";
      date.textContent = `${book.date}  /  ${book.category}`;
      const title = document.createElement("h3");
      title.textContent = book.title;
      const subtitle = document.createElement("p");
      subtitle.className = "book-subtitle";
      subtitle.textContent = `${book.subtitle}  ·  ${book.author}`;
      const noteLabel = document.createElement("p");
      noteLabel.className = "note-label";
      noteLabel.textContent = "读完以后，我记下：";
      const note = document.createElement("blockquote");
      note.className = "book-note";
      note.textContent = book.note;
      copy.append(date, title, subtitle, noteLabel, note);

      article.append(visual, copy);
      list.append(article);
    });
    count.textContent = `共 ${visibleBooks.length} 本`;
    empty.hidden = visibleBooks.length > 0;
  }

  search.addEventListener("input", render);
  document.querySelector(".site-header nav a[href='#books'] i").textContent = String(books.length).padStart(2, "0");
  render();
})();
