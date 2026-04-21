import React from 'react';
import { Layout } from '../../shared/components/Layout';
import { Button, Card } from '../../shared/components/ui/BaseComponents';
import type { PracticeTopic } from './engine';

type ExamTopicFilter = PracticeTopic | 'both';

interface ExamQuestion {
  id: string;
  topic: PracticeTopic;
  prompt: string;
  options: [string, string, string, string];
  correctIndex: number;
}

const EXAM_BANK: ExamQuestion[] = [
  { id: 'S1', topic: 'stack', prompt: 'Thao tác nào thêm phần tử vào Stack?', options: ['pop', 'peek', 'push', 'dequeue'], correctIndex: 2 },
  { id: 'S2', topic: 'stack', prompt: 'Stack tuân theo nguyên tắc nào?', options: ['FIFO', 'LIFO', 'Random', 'Priority'], correctIndex: 1 },
  { id: 'S3', topic: 'stack', prompt: 'Nếu stack là [TOP:A|B], pop sẽ lấy phần tử nào?', options: ['B', 'A', 'C', 'Không lấy được'], correctIndex: 1 },
  { id: 'S4', topic: 'stack', prompt: 'Ứng dụng nào điển hình của Stack?', options: ['Lập lịch CPU', 'Undo/Redo', 'In hàng đợi', 'BFS'], correctIndex: 1 },
  { id: 'S5', topic: 'stack', prompt: 'Thao tác nào chỉ xem đỉnh Stack mà không xóa?', options: ['peek', 'pop', 'push', 'enqueue'], correctIndex: 0 },
  { id: 'S6', topic: 'stack', prompt: 'Với stack rỗng, thao tác nào không hợp lệ?', options: ['push A', 'peek', 'pop', 'peek và pop đều không hợp lệ'], correctIndex: 3 },
  { id: 'Q1', topic: 'queue', prompt: 'Thao tác nào đưa phần tử vào Queue?', options: ['enqueue', 'dequeue', 'push', 'peek'], correctIndex: 0 },
  { id: 'Q2', topic: 'queue', prompt: 'Queue tuân theo nguyên tắc nào?', options: ['LIFO', 'FIFO', 'Random', 'DFS'], correctIndex: 1 },
  { id: 'Q3', topic: 'queue', prompt: 'Nếu queue là [FRONT:A|B], dequeue sẽ lấy phần tử nào?', options: ['B', 'A', 'C', 'Không lấy được'], correctIndex: 1 },
  { id: 'Q4', topic: 'queue', prompt: 'Ứng dụng nào điển hình của Queue?', options: ['Undo editor', 'Duyệt DFS', 'Hàng chờ tác vụ', 'Backtracking'], correctIndex: 2 },
  { id: 'Q5', topic: 'queue', prompt: 'Trong Queue, phần tử mới được thêm vào đâu?', options: ['Front', 'Middle', 'Tail', 'Top'], correctIndex: 2 },
  { id: 'Q6', topic: 'queue', prompt: 'BFS thường dùng cấu trúc nào để quản lý node chờ duyệt?', options: ['Stack', 'Queue', 'Heap', 'Set'], correctIndex: 1 },
];

function shuffle<T>(items: T[]): T[] {
  const copied = [...items];
  for (let i = copied.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copied[i], copied[j]] = [copied[j], copied[i]];
  }
  return copied;
}

function buildExamQuestions(filter: ExamTopicFilter): ExamQuestion[] {
  const scoped =
    filter === 'both' ? EXAM_BANK : EXAM_BANK.filter((question) => question.topic === filter);
  return shuffle(scoped).slice(0, Math.min(10, scoped.length));
}

export const PracticePage = () => {
  const [examTopic, setExamTopic] = React.useState<ExamTopicFilter>('both');
  const [examQuestions, setExamQuestions] = React.useState<ExamQuestion[]>(() =>
    buildExamQuestions('both')
  );
  const [examCurrentIndex, setExamCurrentIndex] = React.useState(0);
  const [examAnswers, setExamAnswers] = React.useState<Record<number, number>>({});
  const [examSubmitted, setExamSubmitted] = React.useState(false);

  const currentExamQuestion = examQuestions[examCurrentIndex];
  const examScore = Object.entries(examAnswers).reduce((acc, [index, answer]) => {
    const question = examQuestions[Number(index)];
    if (!question) return acc;
    return acc + (question.correctIndex === answer ? 1 : 0);
  }, 0);

  const resetExam = (filter: ExamTopicFilter) => {
    setExamTopic(filter);
    setExamQuestions(buildExamQuestions(filter));
    setExamCurrentIndex(0);
    setExamAnswers({});
    setExamSubmitted(false);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">Đề thi trắc nghiệm</h2>
          <div className="flex flex-wrap gap-2">
            <Button variant={examTopic === 'stack' ? 'primary' : 'secondary'} onClick={() => resetExam('stack')}>
              Stack
            </Button>
            <Button variant={examTopic === 'queue' ? 'primary' : 'secondary'} onClick={() => resetExam('queue')}>
              Queue
            </Button>
            <Button variant={examTopic === 'both' ? 'primary' : 'secondary'} onClick={() => resetExam('both')}>
              Cả 2
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-[220px_1fr] gap-4">
          <Card className="bg-white/80 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 p-4 space-y-3">
            <p className="text-sm text-slate-600 dark:text-slate-400">Danh sách câu hỏi</p>
            <div className="grid grid-cols-4 md:grid-cols-3 gap-2">
              {examQuestions.map((question, index) => {
                const selected = examAnswers[index] !== undefined;
                return (
                  <Button
                    key={question.id}
                    size="sm"
                    variant={index === examCurrentIndex ? 'primary' : 'secondary'}
                    className={selected ? 'ring-1 ring-emerald-400/40' : ''}
                    onClick={() => setExamCurrentIndex(index)}
                  >
                    {index + 1}
                  </Button>
                );
              })}
            </div>
          </Card>

          <Card className="bg-white/75 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 p-5 space-y-4">
            {currentExamQuestion ? (
              <>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Câu {examCurrentIndex + 1}/{examQuestions.length} - Chủ đề{' '}
                  <span className="font-semibold text-cyan-700 dark:text-cyan-300 uppercase">{currentExamQuestion.topic}</span>
                </p>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">{currentExamQuestion.prompt}</h4>
                <div className="space-y-2">
                  {currentExamQuestion.options.map((option, optionIndex) => {
                    const labels = ['A', 'B', 'C', 'D'] as const;
                    const isPicked = examAnswers[examCurrentIndex] === optionIndex;
                    const isCorrect = currentExamQuestion.correctIndex === optionIndex;
                    const showCorrect = examSubmitted && isCorrect;
                    const showWrong = examSubmitted && isPicked && !isCorrect;

                    return (
                      <Button
                        key={`${currentExamQuestion.id}-${option}`}
                        variant={isPicked ? 'primary' : 'secondary'}
                        className={
                          showCorrect
                            ? 'w-full justify-start border-emerald-500 text-emerald-800 dark:border-emerald-400 dark:text-emerald-300'
                            : showWrong
                              ? 'w-full justify-start border-rose-500 text-rose-800 dark:border-rose-400 dark:text-rose-300'
                              : 'w-full justify-start'
                        }
                        onClick={() => {
                          if (examSubmitted) return;
                          setExamAnswers((prev) => ({ ...prev, [examCurrentIndex]: optionIndex }));
                        }}
                      >
                        {labels[optionIndex]}. {option}
                      </Button>
                    );
                  })}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => setExamCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev))}
                    disabled={examCurrentIndex === 0}
                  >
                    Câu trước
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() =>
                      setExamCurrentIndex((prev) => (prev < examQuestions.length - 1 ? prev + 1 : prev))
                    }
                    disabled={examCurrentIndex === examQuestions.length - 1}
                  >
                    Câu sau
                  </Button>
                  <Button onClick={() => setExamSubmitted(true)} disabled={Object.keys(examAnswers).length === 0}>
                    Nộp đề
                  </Button>
                  <Button variant="ghost" onClick={() => resetExam(examTopic)}>
                    Random đề mới
                  </Button>
                </div>
                {examSubmitted && (
                  <p className="text-sm font-semibold text-cyan-700 dark:text-cyan-300">
                    Kết quả: {examScore}/{examQuestions.length} câu đúng.
                  </p>
                )}
              </>
            ) : (
              <p className="text-slate-600 dark:text-slate-400">Không có câu hỏi phù hợp với bộ lọc này.</p>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
};
