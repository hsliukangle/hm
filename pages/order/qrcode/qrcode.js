var wxbarcode = require('../../../utils/code.js');

Page({
  data: {
    code: '1234567890123456789'
  },

  onLoad: function () {
    wxbarcode.barcode('barcode', this.data.code, 680, 200);
    wxbarcode.qrcode('qrcode', this.data.code, {
      codeSize: 420,
      color: '#000',
      bgcolor: '#ffffff'
    });
  }
});
