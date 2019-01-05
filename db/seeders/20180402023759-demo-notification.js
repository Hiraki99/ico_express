'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Notifications', [{
      id:1,
      title: 'Notification 1',
      description: 'Những bài văn điểm 10 chấn động mạng 09:37 26/10/2014 77 Những bài văn viết về người thầy cũ đã nghỉ hưu, người bố làm nghề xe ôm hay người mẹ đơn thân thần tảo nuôi con… đã lấy được nước mắt của người đọc. Bài văn về thầy giáo cũ gây xúc động Ngày 16/10, Vũ Phương Thảo (lớp 10A1, THPT Định Hóa) được biết đến với bài văn điểm 10 về người thầy có những cảm xúc trong sáng, chân thành. Bài văn điểm 10 khiến giáo viên nể phục “Đây là lần đầu tôi chấm 10 điểm cho học sinh ở môn Văn. Tôi khâm phục em vì còn ít tuổi nhưng suy nghĩ chín chắn, sâu sắc thể hiện cả con người và cách sống đều rất đẹp". Trong bài văn, Thảo viết: “Máy quay dường như đang chậm lại, từng cảnh từng nét hiện lên rõ ràng. Tôi thấy thầy đang lụi hụi trồng rau, chăm sóc con chó lông trắng đen già khụ, thấy cả chúng tôi ngày đó, trong những ngày vất vả nhưng yên bình',
      link: 'www.google.com',
      url_img: '',
      admin_id: 1,
      // date: ""
    },{
      id:2,
      title: 'Notification 2',
      description: 'Những bài văn điểm 10 chấn động mạng 09:37 26/10/2014 77 Những bài văn viết về người thầy cũ đã nghỉ hưu, người bố làm nghề xe ôm hay người mẹ đơn thân thần tảo nuôi con… đã lấy được nước mắt của người đọc. Bài văn về thầy giáo cũ gây xúc động Ngày 16/10, Vũ Phương Thảo (lớp 10A1, THPT Định Hóa) được biết đến với bài văn điểm 10 về người thầy có những cảm xúc trong sáng, chân thành. Bài văn điểm 10 khiến giáo viên nể phục “Đây là lần đầu tôi chấm 10 điểm cho học sinh ở môn Văn. Tôi khâm phục em vì còn ít tuổi nhưng suy nghĩ chín chắn, sâu sắc thể hiện cả con người và cách sống đều rất đẹp". Trong bài văn, Thảo viết: “Máy quay dường như đang chậm lại, từng cảnh từng nét hiện lên rõ ràng. Tôi thấy thầy đang lụi hụi trồng rau, chăm sóc con chó lông trắng đen già khụ, thấy cả chúng tôi ngày đó, trong những ngày vất vả nhưng yên bình',
      link: 'www.google.com',
      url_img: '',
      admin_id: 1,
      // date: ""
    },
    {
      id:3,
      title: 'Notification 3',
      description: 'Những bài văn điểm 10 chấn động mạng 09:37 26/10/2014 77 Những bài văn viết về người thầy cũ đã nghỉ hưu, người bố làm nghề xe ôm hay người mẹ đơn thân thần tảo nuôi con… đã lấy được nước mắt của người đọc. Bài văn về thầy giáo cũ gây xúc động Ngày 16/10, Vũ Phương Thảo (lớp 10A1, THPT Định Hóa) được biết đến với bài văn điểm 10 về người thầy có những cảm xúc trong sáng, chân thành. Bài văn điểm 10 khiến giáo viên nể phục “Đây là lần đầu tôi chấm 10 điểm cho học sinh ở môn Văn. Tôi khâm phục em vì còn ít tuổi nhưng suy nghĩ chín chắn, sâu sắc thể hiện cả con người và cách sống đều rất đẹp". Trong bài văn, Thảo viết: “Máy quay dường như đang chậm lại, từng cảnh từng nét hiện lên rõ ràng. Tôi thấy thầy đang lụi hụi trồng rau, chăm sóc con chó lông trắng đen già khụ, thấy cả chúng tôi ngày đó, trong những ngày vất vả nhưng yên bình',
      link: 'www.google.com',
      url_img: '',
      admin_id: 1,
      // date: ""
    },
    {
      id:4,
      title: 'Notification 4',
      description: 'Những bài văn điểm 10 chấn động mạng 09:37 26/10/2014 77 Những bài văn viết về người thầy cũ đã nghỉ hưu, người bố làm nghề xe ôm hay người mẹ đơn thân thần tảo nuôi con… đã lấy được nước mắt của người đọc. Bài văn về thầy giáo cũ gây xúc động Ngày 16/10, Vũ Phương Thảo (lớp 10A1, THPT Định Hóa) được biết đến với bài văn điểm 10 về người thầy có những cảm xúc trong sáng, chân thành. Bài văn điểm 10 khiến giáo viên nể phục “Đây là lần đầu tôi chấm 10 điểm cho học sinh ở môn Văn. Tôi khâm phục em vì còn ít tuổi nhưng suy nghĩ chín chắn, sâu sắc thể hiện cả con người và cách sống đều rất đẹp". Trong bài văn, Thảo viết: “Máy quay dường như đang chậm lại, từng cảnh từng nét hiện lên rõ ràng. Tôi thấy thầy đang lụi hụi trồng rau, chăm sóc con chó lông trắng đen già khụ, thấy cả chúng tôi ngày đó, trong những ngày vất vả nhưng yên bình',
      link: 'www.google.com',
      url_img: '',
      admin_id: 1,
      // date: ""
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Notifications', null, {});
  }
};
