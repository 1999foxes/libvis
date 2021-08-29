class Book {
    constructor(id, title, isbn, author, publishyear, press) {
        this.id = id;
        this.title = title;
        this.isbn = isbn;
        this.author = author;
        this.publishyear = publishyear;
        this.press = press;
    }
}


const BookClassification = [
    new Book('A%', '马克思主义、列宁主义、毛泽东思想、邓小平理论'),
    new Book('B%', '哲学、宗教'),
    new Book('C%', '社会科学总论'),
    new Book('D%', '政治、法律'),
    new Book('E%', '军事'),
    new Book('F%', '经济'),
    new Book('G%', '文化、科学、教育、体育'),
    new Book('H%', '语言、文字'),
    new Book('I%', '文学'),
    new Book('J%', '艺术'),
    new Book('K%', '历史、地理'),
    new Book('N%', '自然科学总论'),
    new Book('O%', '数理科学和化学'),
    new Book('P%', '天文学、地球科学'),
    new Book('Q%', '生物科学'),
    new Book('R%', '医药、卫生'),
    new Book('S%', '农业科学'),
    new Book('T%', '工业技术'),
    new Book('U%', '交通运输'),
    new Book('V%', '航空、航天'),
    new Book('X%', '环境科学、安全科学'),
    new Book('Z%', '综合性图书'),
];

export { Book, BookClassification };
