import Header from "@/components/appUI/Header";
import QuizCard from "@/components/appUI/QuizCard";
import { Day2 } from "@/constants/hskD2";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated } from "react-native";
import styled from "styled-components/native";
const PAGE_SIZE = 8;

export default function App() {
  const WORD_BOOKS = [{ id: "Day 2", title: "Day 2", data: Day2 }];

  const { refresh } = useLocalSearchParams();

  const [selectedBook, setSelectedBook] = useState(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [leftCards, setLeftCards] = useState([]);
  const [rightCards, setRightCards] = useState([]);

  const [selectedEn, setSelectedEn] = useState(null);
  const [selectedKo, setSelectedKo] = useState(null);
  const [isShaking, setIsShaking] = useState(false);

  const [wrongWords, setWrongWords] = useState([]);
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
    setWrongWords([]);
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
      setWrongWords((prev) => {
        const alreadyExists = prev.some((item) => item.id === zhWord.id);

        if (alreadyExists) return prev;

        return [...prev, zhWord];
      });

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

  const resetGame = () => {
    setCurrentPage(0);

    setWrongWords([]);

    setIsFinished(false);

    const firstWords = getCurrentWords(0);

    setLeftCards(firstWords);
    setRightCards(shuffleWords(firstWords));
  };

  return (
    <Container>
      <Header />
      {!selectedBook ? (
        <BookSelectBox>
          <BookTitle>단어장을 선택해주세요</BookTitle>

          {WORD_BOOKS.map((book) => (
            <BookButton
              key={book.id}
              onPress={() => {
                setSelectedBook(book.id);
                setCurrentPage(0);
                setIsFinished(false);
                setWrongWords([]);
              }}
            >
              <BookButtonText>{book.title}</BookButtonText>
            </BookButton>
          ))}
        </BookSelectBox>
      ) : (
        <ContentContainer>
          {isFinished ? (
            <ResultBox>
              <ResultTitle>틀린 단어</ResultTitle>

              <ResultScroll>
                {wrongWords.length === 0 ? (
                  <ResultText>틀린 단어가 없어요 🎉</ResultText>
                ) : (
                  wrongWords.map((word) => (
                    <WrongWordCard key={word.id}>
                      <WrongZh>{word.zh}</WrongZh>
                      <WrongInfo>{word.pinyin}</WrongInfo>
                      <WrongKo>{word.ko}</WrongKo>
                    </WrongWordCard>
                  ))
                )}
              </ResultScroll>

              <RestartButton onPress={resetGame}>
                <RestartText>다시하기</RestartText>
              </RestartButton>
            </ResultBox>
          ) : (
            <InfoText>
              {currentPage + 1} / {totalPage} 페이지
            </InfoText>
          )}
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
`;

const ResultText = styled.Text`
  color: white;
  font-size: 18px;
  text-align: center;
  margin-top: 40px;
`;

const WrongWordCard = styled.View`
  background-color: #fffdf0;
  border-radius: 18px;
  padding: 16px;
  margin-bottom: 12px;
`;

const WrongZh = styled.Text`
  color: #263f40;
  font-size: 24px;
  font-weight: bold;
`;

const WrongInfo = styled.Text`
  color: #e75345;
  font-size: 15px;
  margin-top: 4px;
`;

const WrongKo = styled.Text`
  color: #263f40;
  font-size: 17px;
  margin-top: 6px;
`;
const BookSelectBox = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 18px;
`;

const BookTitle = styled.Text`
  color: white;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const BookButton = styled.TouchableOpacity`
  background-color: white;
  padding: 16px 30px;
  border-radius: 18px;
  width: 220px;
  align-items: center;
`;

const BookButtonText = styled.Text`
  color: #087ca7;
  font-size: 18px;
  font-weight: bold;
`;
