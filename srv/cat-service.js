const { update } = require("@sap/cds")

module.exports = (srv) => {

    const {Books} = cds.entities ('my.bookshop')
  
    // Reduce stock of ordered books
    srv.before ('CREATE', 'Orders', async (req) => {
      const order = req.data
      if (!order.amount || order.amount <= 0)  return req.error (400, 'Order at least 1 book')

        //現在の在庫を取得
        let {stock} = await SELECT .one .from(Books)
                                    .columns(b => {b.stock})
                                    .where ({ID: order.book_ID})

        //在庫が足りない場合は処理終了
        if (stock < order.amount) return req.error (409, 'Sold out, sorry!')

        //在庫を更新
        //安竹さんの「書き方１」を採用
        let affectedRows = await UPDATE (Books)
                                .set ({stock: stock - order.amount})
                                .where ({ID: order.book_ID})


        if (affectedRows ===0) req.error (409, 'Sold out, sorry')
    
    })
    
  
    // Add some discount for overstocked books
    srv.after ('READ', 'Books', each => {
      if (each.stock > 111)  each.title += ' -- 11% discount!'
    })
  
  }
  