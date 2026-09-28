import Header from "@/components/appUI/Header";
import QuizCard from "@/components/appUI/QuizCard";
import {
  Day1,
  Day2,
  Day3,
  Day4,
  Day5,
  Day6,
  Day7,
  Day8,
} from "@/constants/hskDay/hskDAll";
import { useLocalSearchParams } from "expo-router";
import * as Speech from "expo-speech";
import { useEffect, useRef, useState } from "react";
import { Animated } from "react-native";
import styled from "styled-components/native";

const PAGE_SIZE = 8;

export default function App() {
  const WORD_BOOKS = [
    { id: "Day 1", title: "Day 1", data: Day1 },
    { id: "Day 2", title: "Day 2", data: Day2 },
    { id: "Day 3", title: "Day 3", data: Day3 },
    { id: "Day 4", title: "Day 4", data: Day4 },
    { id: "Day 5", title: "Day 5", data: Day5 },
    { id: "Day 6", title: "Day 6", data: Day6 },
    { id: "Day 7", title: "Day 7", data: Day7 },
    { id: "Day 8", title: "Day 8", data: Day8 },
  ];

  const { refresh } = useLocalSearchParams();

  const [selectedBook, setSelectedBook] = useState(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [leftCards, setLeftCards] = useState([]);
  const [rightCards, setRightCards] = useState([]);

  const [selectedEn, setSelectedEn] = useState(null);
  const [selectedKo, setSelectedKo] = useState(null);
  const [isShaking, setIsShaking] = useState(false);

  const [reviewWords, setReviewWords] = useState([]);
  const [isFinished, setIsFinished] = useState(false);

  const shakeAnim = useRef(new Animated.Value(0)).current;

  const selectedWords =
    WORD_BOOKS.find((book) => book.id === selectedBook)?.data || [];

  const totalPage = Math.ceil(selectedWords.length / PAGE_SIZE);
  const [showPinyinId, setShowPinyinId] = useState(null);

  const getCurrentWords = (page) => {
    const start = page * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return selectedWords.slice(start, end);
  };

  const shuffleWords = (data) => {
    return [...data].sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    if (!refresh) return;

    setSelectedBook(null);
    setCurrentPage(0);
    setLeftCards([]);
    setRightCards([]);
    setSelectedEn(null);
    setSelectedKo(null);
    setReviewWords([]);
    setIsFinished(false);
    setShowPinyinId(null);
  }, [refresh]);

  useEffect(() => {
    if (!selectedBook) return;

    const currentWords = getCurrentWords(currentPage);

    setLeftCards(currentWords);
    setRightCards(shuffleWords(currentWords));
    setSelectedEn(null);
    setSelectedKo(null);
  }, [currentPage, selectedBook]);

  const shakeCard = () => {
    setIsShaking(true);

    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsShaking(false);
    });
  };

  const checkAnswer = (zhWord, koWord) => {
    if (zhWord.id === koWord.id) {
      setTimeout(() => {
        const newLeftCards = leftCards.filter((item) => item.id !== zhWord.id);
        const newRightCards = rightCards.filter(
          (item) => item.id !== koWord.id,
        );

        setLeftCards(newLeftCards);
        setRightCards(newRightCards);
        setSelectedEn(null);
        setSelectedKo(null);

        if (newLeftCards.length === 0) {
          setTimeout(() => {
            if (currentPage < totalPage - 1) {
              setCurrentPage((prev) => prev + 1);
            } else {
              setIsFinished(true);
            }
          }, 500);
        }
      }, 300);
    } else {
      shakeCard();

      setTimeout(() => {
        setSelectedEn(null);
        setSelectedKo(null);
      }, 500);
    }
  };

  const handleChineseClick = (word) => {
    setSelectedEn(word);

    if (selectedKo) {
      checkAnswer(word, selectedKo);
    }
  };

  const handleKoreanClick = (word) => {
    setSelectedKo(word);

    if (selectedEn) {
      checkAnswer(selectedEn, word);
    }
  };

  const getShakeStyle = (isSelected) => {
    if (!isSelected || !isShaking) return {};

    return {
      transform: [{ translateX: shakeAnim }],
    };
  };

  const speakChinese = (text) => {
    Speech.stop();

    Speech.speak(text, {
      language: "zh-CN",
      rate: 0.75,
      pitch: 1.0,
    });
  };

  const resetGame = () => {
    setCurrentPage(0);
    setReviewWords([]);
    setIsFinished(false);

    const firstWords = getCurrentWords(0);

    setLeftCards(firstWords);
    setRightCards(shuffleWords(firstWords));
  };

  const toggleReviewWord = (word) => {
    setReviewWords((prev) => {
      const alreadySaved = prev.some((item) => item.id === word.id);

      if (alreadySaved) {
        return prev.filter((item) => item.id !== word.id);
      }

      return [...prev, word];
    });
  };

  return (
    <Container>
      <Header />
      {!selectedBook ? (
        <BookSelectScroll
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: "center",
            paddingTop: 30,
            paddingBottom: 50,
          }}
        >
          <BookTitle>단어장을 선택해주세요</BookTitle>

          {WORD_BOOKS.map((book) => (
            <BookButton
              key={book.id}
              onPress={() => {
                setSelectedBook(book.id);
                setCurrentPage(0);
                setIsFinished(false);
                setReviewWords([]);
                setShowPinyinId(null);
              }}
            >
              <BookButtonText>{book.title}</BookButtonText>
            </BookButton>
          ))}
        </BookSelectScroll>
      ) : (
        <ContentContainer>
          {isFinished ? (
            <ResultBox>
              <ResultTitle>복습할 단어</ResultTitle>

              <ResultScroll
                contentContainerStyle={{
                  paddingBottom: 30,
                }}
              >
                {reviewWords.length === 0 ? (
                  <ResultText>저장한 단어가 없어요 🎉</ResultText>
                ) : (
                  reviewWords.map((word) => (
                    <WrongWordCard key={word.id}>
                      <WrongTopRow>
                        <WrongZh>{word.zh}</WrongZh>

                        <SoundButton onPress={() => speakChinese(word.zh)}>
                          <SoundButtonText>🔊</SoundButtonText>
                        </SoundButton>
                      </WrongTopRow>

                      <PinyinRow>
                        <WrongInfo>{word.pinyin}</WrongInfo>

                        <SmallSoundButton onPress={() => speakChinese(word.zh)}>
                          <SmallSoundText>발음 듣기</SmallSoundText>
                        </SmallSoundButton>
                      </PinyinRow>

                      <WrongKo>{word.ko.join(", ")}</WrongKo>
                    </WrongWordCard>
                  ))
                )}
              </ResultScroll>

              <RestartButton onPress={resetGame}>
                <RestartText>다시하기</RestartText>
              </RestartButton>
            </ResultBox>
          ) : (
            <>
              <InfoText>
                {currentPage + 1} / {totalPage} 페이지
              </InfoText>

              <ScrollArea>
                <QuizBox>
                  <Column>
                    {leftCards.map((word) => {
                      const isSelected = selectedEn?.id === word.id;

                      return (
                        <QuizCard
                          key={word.id}
                          word={word}
                          type="zh"
                          selected={isSelected}
                          style={getShakeStyle(isSelected)}
                          onPress={() => handleChineseClick(word)}
                          marked={reviewWords.some(
                            (item) => item.id === word.id,
                          )}
                          onToggleMark={() => toggleReviewWord(word)}
                        />
                      );
                    })}
                  </Column>

                  <Column>
                    {rightCards.map((word) => {
                      const isSelected = selectedKo?.id === word.id;

                      return (
                        <QuizCard
                          key={word.id}
                          word={word}
                          type="ko"
                          selected={isSelected}
                          style={getShakeStyle(isSelected)}
                          onPress={() => handleKoreanClick(word)}
                          showPinyin={showPinyinId === word.id}
                          onTogglePinyin={() =>
                            setShowPinyinId((prev) =>
                              prev === word.id ? null : word.id,
                            )
                          }
                        />
                      );
                    })}
                  </Column>
                </QuizBox>
              </ScrollArea>
            </>
          )}
        </ContentContainer>
      )}
    </Container>
  );
}
const Container = styled.SafeAreaView`
  flex: 1;
  background-color: #4aa7ea;

  //   #087ca7;
`;

const ContentContainer = styled.SafeAreaView`
  flex: 1;
  background-color: #2479b5;
`;

const InfoText = styled.Text`
  margin-top: 20px;
  text-align: center;
  color: white;
  font-size: 18px;
  font-weight: bold;
`;
const ScrollArea = styled.ScrollView.attrs({
  contentContainerStyle: {
    paddingVertical: 30,
    alignItems: "center",
  },
})`
  flex: 1;
`;

const QuizBox = styled.View`
  flex-direction: row;
  justify-content: center;
  gap: 25px;
`;

const Column = styled.View`
  gap: 25px;
`;

const RestartButton = styled.TouchableOpacity`
  margin: 20px auto;
  background-color: white;
  padding: 14px 24px;
  border-radius: 16px;
`;

const RestartText = styled.Text`
  color: #087ca7;
  font-size: 18px;
  font-weight: bold;
`;
const ResultBox = styled.View`
  flex: 1;
  padding: 24px;
  padding-bottom: 12px;
`;

const ResultTitle = styled.Text`
  color: white;
  font-size: 26px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
`;

const ResultScroll = styled.ScrollView`
  flex: 1;
  width: 100%;
`;

const ResultText = styled.Text`
  color: white;
  font-size: 18px;
  text-align: center;
  margin-top: 40px;
`;

const WrongWordCard = styled.View`
  background-color: #fffdf0;
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 14px;
  min-height: 125px;
`;

const WrongZh = styled.Text`
  color: #263f40;
  font-size: 30px;
  font-weight: bold;
`;

const WrongInfo = styled.Text`
  color: #e75345;
  font-size: 17px;
`;

const WrongKo = styled.Text`
  color: #263f40;
  font-size: 18px;
  margin-top: 10px;
`;

const BookSelectScroll = styled.ScrollView`
  flex: 1;
  width: 100%;
`;

const BookTitle = styled.Text`
  color: white;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const BookButton = styled.TouchableOpacity`
  background-color: white;
  padding: 20px 30px;
  border-radius: 18px;
  width: 220px;

  align-items: center;
  margin-bottom: 20px;
`;

const BookButtonText = styled.Text`
  color: #087ca7;
  font-size: 18px;
  font-weight: bold;
`;

const WrongTopRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const PinyinRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 6px;
  gap: 10px;
`;

const SoundButton = styled.TouchableOpacity`
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background-color: #eaf6ff;
  align-items: center;
  justify-content: center;
`;

const SoundButtonText = styled.Text`
  font-size: 20px;
`;

const SmallSoundButton = styled.TouchableOpacity`
  background-color: #eaf6ff;
  border-radius: 12px;
  padding: 5px 10px;
`;

const SmallSoundText = styled.Text`
  color: #2479b5;
  font-size: 12px;
  font-weight: bold;
`;
