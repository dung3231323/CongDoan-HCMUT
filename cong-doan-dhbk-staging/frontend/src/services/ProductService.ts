export const ProductService = {
  getProductsData() {
    return [
      {
        STT: 0,
        MSCB: 1,
        'Họ và tên lót': 'string',
        Tên: 'string',
        'Nội dung hoạt đông': 'string',
        'Ngày diễn ra': 'string',
        'Ngày kết thúc': 'string',
        'Người tạo': 'string',
        'Công đoàn': 'string',
      },
      {
        STT: 1,
        MSCB: 2,
        'Họ và tên lót': 'string',
        Tên: 'string',
        'Nội dung hoạt đông': 'string',
        'Ngày diễn ra': 'string',
        'Ngày kết thúc': 'string',
        'Người tạo': 'string',
        'Công đoàn': 'string',
      },
    ];
  },

  getProductsMini() {
    return Promise.resolve(this.getProductsData().slice(0, 5));
  },

  getProductsSmall() {
    return Promise.resolve(this.getProductsData().slice(0, 10));
  },

  getProducts() {
    return Promise.resolve(this.getProductsData());
  },
};
