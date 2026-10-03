import {
  Day1,
  Day2,
  Day3,
  Day4,
  Day5,
  Day6,
  Day7,
  Day8,
  Day9,
  Day10,
} from "@/constants/hskDay/hskDAll";

import * as Speech from "expo-speech";
import { useEffect, useState } from "react";
import styled from "styled-components/native";

const WORD_BOOKS = [
  { id: "Day 1", title: "Day 1", data: Day1 },
  { id: "Day 2", title: "Day 2", data: Day2 },
  { id: "Day 3", title: "Day 3", data: Day3 },
  { id: "Day 4", title: "Day 4", data: Day4 },
  { id: "Day 5", title: "Day 5", data: Day5 },
  { id: "Day 6", title: "Day 6", data: Day6 },
  { id: "Day 7", title: "Day 7", data: Day7 },
  { id: "Day 8", title: "Day 8", data: Day8 },
  { id: "Day 9", title: "Day 9", data: Day9 },
  { id: "Day 10", title: "Day 10", data: Day10 },
];

const shuffle = (array: any[]) => {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
};

export default function ListeningGame() {
  const [selectedBook, setSelectedBook] = useState<any>(null);

  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [choices, setChoices] = useState<any[]>([]);

  const [selectedChoice, setSelectedChoice] = useState<any>(null);
  const [wrongChoice, setWrongChoice] = useState<any>(null);

  const [showAnswer, setShowAnswer] = useState(false);
  const [finished, setFinished] = useState(false);

  const currentWord = questions[currentIndex];

  // =========================
  // 중국어 음성
  // =========================

  const speak = (text: string) => {
    Speech.stop();

    Speech.speak(text, {
      language: "zh-CN",
      rate: 0.5,
      pitch: 0.7,
    });
  };

  // =========================
  // Day 선택 → 40문제 생성
  // =========================

  const startGame = (book: any) => {
    const allWords = shuffle(book.data);

    setSelectedBook(book);

    // ⭐ 10개로 자르지 않고 Day 전체 사용
    setQuestions(allWords);

    setCurrentIndex(0);
    setSelectedChoice(null);
    setWrongChoice(null);
    setShowAnswer(false);
    setFinished(false);
  };

  // =========================
  // 선택지 만들기
  // =========================

  const makeChoices = () => {
    if (!currentWord || !selectedBook) return;

    const wrongAnswers = shuffle(
      selectedBook.data.filter((word: any) => word.id !== currentWord.id),
    ).slice(0, 3);

    const newChoices = shuffle([currentWord, ...wrongAnswers]);

    setChoices(newChoices);
  };

  // =========================
  // 문제 바뀔 때
  // =========================

  useEffect(() => {
    if (!currentWord) return;

    makeChoices();

    setSelectedChoice(null);
    setWrongChoice(null);
    setShowAnswer(false);

    const timer = setTimeout(() => {
      speak(currentWord.zh);
    }, 400);

    return () => clearTimeout(timer);
  }, [currentIndex, questions]);

  // =========================
  // 정답 선택
  // =========================

  const handleChoice = (word: any) => {
    if (showAnswer) return;

    setSelectedChoice(word);

    if (word.id === currentWord.id) {
      // 정답이면 답을 보여주고 그대로 멈춤
      setShowAnswer(true);
    } else {
      setWrongChoice(word);

      setTimeout(() => {
        setWrongChoice(null);
        setSelectedChoice(null);
      }, 500);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setFinished(true);
    }
  };

  // =========================
  // 다시 시작
  // =========================

  const restartGame = () => {
    if (!selectedBook) return;

    startGame(selectedBook);
  };

  // =========================
  // Day 선택으로 돌아가기
  // =========================

  const goBack = () => {
    Speech.stop();

    setSelectedBook(null);
    setQuestions([]);
    setCurrentIndex(0);
    setFinished(false);
  };

  // =========================
  // DAY 선택 화면
  // =========================

  if (!selectedBook) {
    return (
      <Container>
        <DayScroll
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: "center",
            paddingTop: 50,
            paddingBottom: 60,
          }}
        >
          <Emoji>🎧</Emoji>

          <MainTitle>중국어 귀뚫기</MainTitle>

          <SubTitle>들리는 중국어의 뜻을 맞혀봐!</SubTitle>

          <DayTitle>단어장 선택</DayTitle>

          {WORD_BOOKS.map((book) => (
            <DayButton key={book.id} onPress={() => startGame(book)}>
              <DayButtonText>{book.title}</DayButtonText>

              <DayCount>{book.data.length}단어</DayCount>
            </DayButton>
          ))}
        </DayScroll>
      </Container>
    );
  }

  // =========================
  // 게임 완료
  // =========================

  if (finished) {
    return (
      <Container>
        <CenterBox>
          <FinishEmoji>🎉</FinishEmoji>

          <FinishTitle>귀뚫기 완료!</FinishTitle>

          <FinishText>
            {selectedBook.title}의 {questions.length}단어를 전부 들었어
          </FinishText>

          <RestartButton onPress={restartGame}>
            <RestartButtonText>🔄 다시 듣기</RestartButtonText>
          </RestartButton>

          <BackButton onPress={goBack}>
            <BackButtonText>다른 Day 선택</BackButtonText>
          </BackButton>
        </CenterBox>
      </Container>
    );
  }

  // =========================
  // 게임 화면
  // =========================
  return (
    <Container>
      <GameScroll
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 30,
        }}
      >
        <GameContainer>
          <TopRow>
            <SmallBackButton onPress={goBack}>
              <SmallBackText>‹</SmallBackText>
            </SmallBackButton>

            <Progress>
              {currentIndex + 1} / {questions.length}
            </Progress>

            <EmptySpace />
          </TopRow>

          <QuestionArea>
            <ListenText>뭐라고 들려?</ListenText>

            <SpeakerButton onPress={() => speak(currentWord.zh)}>
              <SpeakerEmoji>🔊</SpeakerEmoji>
            </SpeakerButton>

            <ReplayText>눌러서 다시 듣기</ReplayText>

            {showAnswer && (
              <AnswerReveal>
                <ChineseText>{currentWord.zh}</ChineseText>
                <PinyinText>{currentWord.pinyin}</PinyinText>
              </AnswerReveal>
            )}
          </QuestionArea>

          <ChoiceArea>
            {choices.map((word) => {
              const isCorrect = showAnswer && word.id === currentWord.id;

              const isWrong = wrongChoice?.id === word.id;

              return (
                <ChoiceButton
                  key={word.id}
                  onPress={() => handleChoice(word)}
                  $correct={isCorrect}
                  $wrong={isWrong}
                >
                  <ChoiceText>
                    {Array.isArray(word.ko) ? word.ko.join(", ") : word.ko}
                  </ChoiceText>
                </ChoiceButton>
              );
            })}
          </ChoiceArea>

          {showAnswer && (
            <NextButton onPress={handleNext}>
              <NextButtonText>
                {currentIndex === questions.length - 1 ? "완료 ✓" : "다음 →"}
              </NextButtonText>
            </NextButton>
          )}

          <BottomProgress>
            <ProgressBar>
              <ProgressFill
                style={{
                  width: `${((currentIndex + 1) / questions.length) * 100}%`,
                }}
              />
            </ProgressBar>
          </BottomProgress>
        </GameContainer>
      </GameScroll>
    </Container>
  );
}

// =========================
// STYLE
// =========================

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: #f4f9ff;
`;
const GameScroll = styled.ScrollView`
  flex: 1;
  width: 100%;
`;

const DayScroll = styled.ScrollView`
  flex: 1;
  width: 100%;
`;

const Emoji = styled.Text`
  font-size: 60px;
  margin-bottom: 10px;
`;

const MainTitle = styled.Text`
  font-size: 30px;
  font-weight: 800;
  color: #222;
`;

const SubTitle = styled.Text`
  font-size: 15px;
  color: #777;
  margin-top: 8px;
  margin-bottom: 35px;
`;

const DayTitle = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: #444;
  margin-bottom: 18px;
`;

const DayButton = styled.TouchableOpacity`
  width: 260px;
  background-color: white;
  padding: 18px 22px;
  border-radius: 20px;
  margin-bottom: 13px;

  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const DayButtonText = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: #333;
`;

const DayCount = styled.Text`
  font-size: 13px;
  color: #999;
`;

const GameContainer = styled.View`
  flex: 1;
  padding: 20px;
`;

const TopRow = styled.View`
  height: 55px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const SmallBackButton = styled.TouchableOpacity`
  width: 45px;
`;

const SmallBackText = styled.Text`
  font-size: 40px;
  color: #444;
`;

const Progress = styled.Text`
  font-size: 17px;
  font-weight: 700;
  color: #555;
`;

const EmptySpace = styled.View`
  width: 45px;
`;

const QuestionArea = styled.View`
  align-items: center;
  margin-top: 45px;
`;

const ListenText = styled.Text`
  font-size: 24px;
  font-weight: 800;
  color: #222;
  margin-bottom: 30px;
`;

const SpeakerButton = styled.TouchableOpacity`
  width: 125px;
  height: 125px;
  border-radius: 63px;
  background-color: #4aa7ea;

  align-items: center;
  justify-content: center;
`;

const SpeakerEmoji = styled.Text`
  font-size: 55px;
`;

const ReplayText = styled.Text`
  font-size: 13px;
  color: #999;
  margin-top: 13px;
`;

const AnswerReveal = styled.View`
  align-items: center;
  margin-top: 18px;
`;

const ChineseText = styled.Text`
  font-size: 31px;
  font-weight: 800;
  color: #222;
`;

const PinyinText = styled.Text`
  font-size: 17px;
  color: #777;
  margin-top: 3px;
`;

const ChoiceArea = styled.View`
  margin-top: 35px;
  gap: 13px;
`;

const ChoiceButton = styled.TouchableOpacity<{
  $correct?: boolean;
  $wrong?: boolean;
}>`
  width: 100%;
  min-height: 68px;

  background-color: ${(props) =>
    props.$correct ? "#dff7e7" : props.$wrong ? "#ffe2e2" : "white"};

  border-width: 2px;

  border-color: ${(props) =>
    props.$correct ? "#55c77a" : props.$wrong ? "#ef7070" : "#e8edf2"};

  border-radius: 18px;

  align-items: center;
  justify-content: center;

  padding: 13px 18px;
`;

const ChoiceText = styled.Text`
  font-size: 17px;
  font-weight: 600;
  color: #333;
  text-align: center;
`;

const BottomProgress = styled.View`
  margin-top: auto;
  padding-bottom: 15px;
`;

const ProgressBar = styled.View`
  width: 100%;
  height: 8px;
  background-color: #e2e8ef;
  border-radius: 10px;
  overflow: hidden;
`;

const ProgressFill = styled.View`
  height: 100%;
  background-color: #4aa7ea;
  border-radius: 10px;
`;

const CenterBox = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 30px;
`;

const FinishEmoji = styled.Text`
  font-size: 70px;
`;

const FinishTitle = styled.Text`
  font-size: 30px;
  font-weight: 800;
  color: #222;
  margin-top: 20px;
`;

const FinishText = styled.Text`
  font-size: 16px;
  color: #777;
  margin-top: 10px;
  margin-bottom: 35px;
`;

const RestartButton = styled.TouchableOpacity`
  width: 230px;
  background-color: #4aa7ea;
  padding: 17px;
  border-radius: 18px;
  align-items: center;
  margin-bottom: 12px;
`;

const RestartButtonText = styled.Text`
  color: white;
  font-size: 17px;
  font-weight: 700;
`;

const BackButton = styled.TouchableOpacity`
  width: 230px;
  background-color: white;
  padding: 17px;
  border-radius: 18px;
  align-items: center;
`;

const BackButtonText = styled.Text`
  color: #555;
  font-size: 16px;
  font-weight: 600;
`;
const NextButton = styled.TouchableOpacity`
  margin-top: 22px;
  width: 100%;
  background-color: #4aa7ea;
  padding: 17px;
  border-radius: 18px;
  align-items: center;
`;

const NextButtonText = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: 800;
`;
