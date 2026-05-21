// @ts-nocheck
import { CATEGORIES } from '../constants/assessment';

const COLORS = {
  level1: '#16A34A',
  level2: '#EAB308',
  level3: '#F97316',
  level4: '#DC2626',
  level5: '#7F1D1D',
};

export function mapApiHistoryToLegacy(entry) {
  return {
    date: entry.date,
    totalScore: entry.totalScore,
    level: entry.stressLevel?.level ?? 0,
    levelLabel: entry.stressLevel?.label ?? '',
    levelColor: entry.stressLevel?.color ?? COLORS.level3,
    categories: (entry.categoryScores || []).map((c) => ({ id: c.id, sum: c.sum, max: c.max })),
  };
}

export function getStressLevel(total) {
  if (total <= 43) return { level: 1, label: 'Stress lành mạnh', sub: 'Eustress · Bạn đang cân bằng tốt', color: COLORS.level1, emoji: '🌱', summary: 'Mức stress của bạn đang ở vùng lành mạnh, mang tính tạo động lực. Bạn đang xử lý áp lực một cách xây dựng — hãy tiếp tục bảo vệ những thói quen đang giúp bạn ổn.' };
  if (total <= 62) return { level: 2, label: 'Stress cấp tính', sub: 'Áp lực ngắn hạn', color: COLORS.level2, emoji: '🌤️', summary: 'Bạn đang trải qua những đợt áp lực ngắn. Vẫn nằm trong tầm kiểm soát, nhưng đáng để quan sát — vài điều chỉnh nhỏ ngay bây giờ sẽ tránh tình trạng tích lũy.' };
  if (total <= 82) return { level: 3, label: 'Stress lặp lại', sub: 'Áp lực đang tái diễn', color: COLORS.level3, emoji: '⛅', summary: 'Stress đang trở thành một mô hình lặp lại. Hồi phục khó hơn bình thường. Đây là thời điểm để xác định 1–2 nguyên nhân chính và xử lý chúng có chủ đích.' };
  if (total <= 101) return { level: 4, label: 'Stress mãn tính', sub: 'Quá tải kéo dài', color: COLORS.level4, emoji: '🌧️', summary: 'Bạn đang gánh một mức quá tải kéo dài. Hiệu suất, sự tập trung và sức khỏe tinh thần đều đang chịu rủi ro. Cần một can thiệp có cấu trúc — về khối lượng, ranh giới và sự hỗ trợ.' };
  return { level: 5, label: 'Nguy cơ burnout cao', sub: 'Tín hiệu quan trọng — cần được ưu tiên', color: COLORS.level5, emoji: '⚠️', summary: 'Nhiều tín hiệu cho thấy nguy cơ burnout đã ở mức cao. Điều này xứng đáng được hành động ngay lập tức và một cách nhân ái — giảm tải, tìm kiếm hỗ trợ, ưu tiên hồi phục. Bạn không một mình.' };
}

export function classifyCategory(sum, count) {
  const lowMax = count * 2;
  const moderateMax = count * (10 / 3);
  if (sum <= lowMax) return { level: 'Thấp', levelEn: 'Low', color: COLORS.level1 };
  if (sum <= moderateMax) return { level: 'Trung bình', levelEn: 'Moderate', color: COLORS.level3 };
  return { level: 'Cao', levelEn: 'High', color: COLORS.level4 };
}

const RECOMMENDATIONS = {
  workload: { title: 'Đặt lại ranh giới khối lượng công việc', items: ['Dành 20 phút audit toàn bộ công việc đang chạy. Đánh dấu chỉ Top 3 việc thực sự tạo kết quả tuần này.','Hủy hoặc ủy quyền 1 cuộc họp định kỳ không tạo ra quyết định nào.','Khóa 90 phút deep-work trên lịch trước 11h sáng, mỗi ngày.','Tạo nghi thức "tắt việc" rõ ràng — đóng laptop, đi bộ, thay đồ — để tâm trí thật sự rời khỏi công việc.']},
  conflict: { title: 'Giảm ma sát trong các mối quan hệ công việc', items: ['Xác định 1 mối quan hệ tiêu hao năng lượng nhiều nhất. Chủ động sắp xếp một cuộc trò chuyện trực tiếp, không nặng nề trong tuần này.','Khi raise vấn đề, dùng cấu trúc "Quan sát → Tác động → Đề xuất" thay vì lời buộc tội.','Nếu xung đột mang tính cấu trúc (chồng chéo vai trò), escalate lên cấp quản lý chung kèm văn bản tóm tắt — không phải buổi xả.','Bảo vệ tâm lý an toàn trong team của chính bạn: chủ động mời sự bất đồng trong các cuộc họp.']},
  expectation: { title: 'Làm rõ thế nào là thành công', items: ['Viết 3 KPI quan trọng nhất, mỗi cái 1 câu. Gửi cho sếp và hỏi: "Mình đang đồng ý với nhau chưa?"','Đề nghị một danh sách ưu tiên bằng văn bản từ stakeholders. Khi ưu tiên thay đổi, hỏi rõ điều gì sẽ bị deprioritize.','Đặt một check-in 15 phút hàng tuần với sếp để align ưu tiên.','Document tiêu chí thành công của dự án trọng yếu hiện tại trước khi làm thêm bất kỳ task nào.']},
  balance: { title: 'Khôi phục năng lực hồi phục', items: ['Đặt một giờ kết thúc cứng. Coi nó như một cuộc họp trên lịch.','Bảo vệ 7+ tiếng ngủ — đây là can thiệp có đòn bẩy lớn nhất cho phục hồi từ burnout.','Lên lịch 1 ngày offline hoàn toàn mỗi tuần (không email, không Slack) trong 4 tuần liên tiếp.','Thêm 1 hoạt động hồi phục nhẹ mỗi ngày: đi bộ 20 phút, ăn không màn hình, hít thở sâu.']},
  autonomy: { title: 'Lấy lại quyền sở hữu và không gian quyết định', items: ['Xác định 1–2 quyết định bạn đang phải xin phép mà thực ra có thể tự ra. Đề xuất sự thay đổi này với sếp.','Lập sơ đồ các nút thắt phê duyệt và đề xuất ma trận RACI cho chúng.','Reframe câu hỏi từ "Em xin phép..." thành "Em đang dự định... nếu anh/chị không có ý kiến khác."','Khóa thời gian hàng tuần cho việc tự định hướng, không phải việc phản ứng.']},
  rewards: { title: 'Củng cố sự ghi nhận và công bằng', items: ['Đề nghị một buổi feedback có cấu trúc tập trung vào những gì đang làm tốt — không chỉ điểm cần cải thiện.','Document và chia sẻ những thành tựu hàng tháng. Sự nhìn thấy đến trước sự ghi nhận.','Có một cuộc trò chuyện thẳng thắn về lộ trình sự nghiệp: cấp tiếp theo trông như thế nào và khi nào?','Nếu bạn là quản lý: triển khai micro-recognition hàng tuần (cụ thể, công khai, chân thành).']},
  burnout: { title: 'Ưu tiên hồi phục — đây là việc khẩn', items: ['Giảm khối lượng ngay lập tức. Bàn giao, hoãn, hoặc loại ít nhất 30% cam kết hiện tại trong tuần này.','Đặt lịch 1:1 với sếp chỉ để bàn về workload và sự hỗ trợ — không phải status dự án.','Lấy ngày nghỉ sớm nhất có thể (tối thiểu một kỳ cuối tuần dài). Hồi phục không phải là tùy chọn.','Cân nhắc hỗ trợ chuyên môn — coach, therapist, hoặc EAP. Burnout có thể chữa được; nó không tự khỏi bằng cách làm việc nhiều hơn.']},
};

export function computeScores(answers) {
  const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
  const categoryScores = CATEGORIES.map((cat) => {
    const ids = cat.questions.map((_, qi) => `${cat.id}-${qi}`);
    const values = ids.map((id) => answers[id] || 0);
    const sum = values.reduce((a, b) => a + b, 0);
    const max = cat.questions.length * 5;
    return { ...cat, sum, max, perQuestionAvg: values.length ? sum / values.length : 0, values };
  });
  return { totalScore, categoryScores };
}

export function buildRecommendations(categoryScores) {
  const ranked = [...categoryScores].sort((a, b) => b.perQuestionAvg - a.perQuestionAvg);
  const primary = ranked.filter((cat) => classifyCategory(cat.sum, cat.questions.length).levelEn === 'High');
  const drivers = primary.length > 0 ? primary : [ranked[0]];
  return drivers.map((cat) => ({ categoryId: cat.id, label: cat.label, iconKey: cat.iconKey, ...RECOMMENDATIONS[cat.id] }));
}
