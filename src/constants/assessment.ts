// @ts-nocheck
export const CATEGORIES = [
  { id: 'workload', label: 'Khối lượng công việc', short: 'Khối lượng', icon: '01', iconKey: 'battery', description: 'Quá tải, đa nhiệm, áp lực deadline', questions: ['Tôi cảm thấy lượng công việc vượt quá thời gian và năng lượng tôi có.','Tôi thường xuyên làm việc dưới deadline gấp gáp hoặc áp lực liên tục.','Tôi khó tách khỏi suy nghĩ về công việc sau giờ làm.']},
  { id: 'conflict', label: 'Xung đột với đồng nghiệp', short: 'Xung đột', icon: '02', iconKey: 'users', description: 'Căng thẳng quan hệ, va chạm trong hợp tác', questions: ['Tôi cảm thấy căng thẳng khi làm việc với đồng nghiệp hoặc cấp trên.','Tôi né giao tiếp trực tiếp vì sợ xung đột hoặc bị đánh giá.','Tôi thấy mâu thuẫn nơi công sở thường không được giải quyết rõ ràng.']},
  { id: 'expectation', label: 'Kỳ vọng không rõ ràng', short: 'Kỳ vọng', icon: '03', iconKey: 'compass', description: 'Mơ hồ về mục tiêu, ưu tiên, tiêu chí đánh giá', questions: ['Tôi không phải lúc nào cũng biết rõ "thành công trong công việc" trông như thế nào.','Tôi thường phải đoán kỳ vọng của sếp hoặc các bên liên quan.','Tôi thấy thứ tự ưu tiên hoặc tiêu chí đánh giá thay đổi quá thường xuyên.']},
  { id: 'balance', label: 'Mất cân bằng cuộc sống', short: 'Cân bằng', icon: '04', iconKey: 'scale', description: 'Work–life imbalance, khó hồi phục', questions: ['Công việc ảnh hưởng tiêu cực đến cuộc sống cá nhân hoặc thời gian nghỉ ngơi của tôi.','Tôi khó hồi phục năng lượng sau giờ làm hoặc sau cuối tuần.','Tôi thường cảm thấy kiệt sức về thể chất hoặc tinh thần vì công việc.']},
  { id: 'autonomy', label: 'Thiếu quyền tự chủ', short: 'Tự chủ', icon: '05', iconKey: 'target', description: 'Ít quyền kiểm soát, ít quyền ra quyết định', questions: ['Tôi cảm thấy có ít quyền kiểm soát cách mình làm việc.','Tôi cần quá nhiều phê duyệt trước khi hành động.','Tôi thấy tiếng nói của mình ít có ảnh hưởng đến các quyết định công việc.']},
  { id: 'rewards', label: 'Phần thưởng không tương xứng', short: 'Ghi nhận', icon: '06', iconKey: 'award', description: 'Thiếu ghi nhận và sự công bằng', questions: ['Tôi cảm thấy nỗ lực của mình chưa được ghi nhận đầy đủ.','Tôi thấy phần thưởng hoặc cơ hội phát triển không tương xứng với đóng góp.','Tôi hiếm khi nhận được phản hồi tích cực hoặc lời cảm ơn.']},
  { id: 'burnout', label: 'Dấu hiệu kiệt sức', short: 'Kiệt sức', icon: '07', iconKey: 'handshake', description: 'Triệu chứng burnout trực tiếp (theo MBI)', questions: ['Tôi cảm thấy cạn kiệt cảm xúc trước hoặc sau giờ làm.','Tôi cảm thấy xa cách hoặc lạnh nhạt với công việc.','Tôi cảm thấy hiệu suất của mình giảm so với trước đây.','Tôi dễ cáu gắt hoặc mất kiên nhẫn hơn.','Công việc cảm thấy ít ý nghĩa hơn so với trước.','Tôi cảm giác mình đang "chịu đựng" công việc thay vì thực sự gắn bó.']},
];

export const ALL_QUESTIONS = CATEGORIES.flatMap((cat, ci) =>
  cat.questions.map((q, qi) => ({ id: `${cat.id}-${qi}`, text: q, categoryId: cat.id, categoryLabel: cat.label, categoryIndex: ci, questionIndex: qi }))
);

export const SCALE = [
  { value: 1, label: 'Hầu như không bao giờ', emoji: '😌' },
  { value: 2, label: 'Hiếm khi', emoji: '🙂' },
  { value: 3, label: 'Thỉnh thoảng', emoji: '😐' },
  { value: 4, label: 'Thường xuyên', emoji: '😟' },
  { value: 5, label: 'Hầu như luôn luôn', emoji: '😣' },
];

export const MILESTONES = {
  6: { iconKey: 'coffee', title: 'Bạn đang làm rất tốt 🌱', message: 'Đôi khi chỉ cần dừng lại và lắng nghe bản thân đã là một bước tiến lớn. Cứ tiếp tục, không có câu trả lời nào sai cả.', cta: 'Tiếp tục thôi nào' },
  12: { iconKey: 'wind', title: 'Đã đi được nửa chặng đường 💪', message: 'Hít một hơi thở sâu. Cảm ơn vì sự thành thật của bạn — chính sự thành thật này là điều giúp bài test trở nên hữu ích.', cta: 'Mình tiếp tục nhé' },
  18: { iconKey: 'sun', title: 'Còn 6 câu nữa thôi ✨', message: 'Bạn đang làm điều ý nghĩa — không phải ai cũng dành thời gian lắng nghe chính mình như thế này.', cta: 'Hoàn thành nốt nào' },
};
