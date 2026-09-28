import * as Speech from "expo-speech";
import { Animated } from "react-native";
import styled from "styled-components/native";

export default function QuizCard({
  word,
  type,
  selected,
  style,
  onPress,
  showPinyin,
  marked,
  onToggleMark,
  onTogglePinyin,
}) {
  const speakWord = (e) => {
    e?.stopPropagation?.();

    Speech.stop();

    Speech.speak(word.zh, {
      language: "zh-CN",
      rate: 0.5,
      pitch: 0.7,
    });
  };

  return (
    <Card
      $selected={selected}
      style={style}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <MainArea>
        {type === "zh" ? (
          <>
            <CardText $type={type}>{word.zh}</CardText>

            <MarkButton
              onPress={(e) => {
                e.stopPropagation();
                onToggleMark?.();
              }}
            >
              <MarkText>{marked ? "★" : "☆"}</MarkText>
            </MarkButton>
          </>
        ) : (
          <CardText $type={type}>{word.ko.join(", ")}</CardText>
        )}
      </MainArea>

      {/* 한국어 카드에만 병음 + 소리 버튼 */}
      {type === "ko" && (
        <BottomArea>
          <PinyinButton
            onPress={(e) => {
              e.stopPropagation();
              onTogglePinyin?.();
            }}
          >
            {showPinyin ? (
              <PinyinText>{word.pinyin}</PinyinText>
            ) : (
              <PinyinHint>병음</PinyinHint>
            )}
          </PinyinButton>

          <SoundButton onPress={speakWord}>
            <SoundText>🔊</SoundText>
          </SoundButton>
        </BottomArea>
      )}
    </Card>
  );
}

const Card = styled(
  Animated.createAnimatedComponent(styled.TouchableOpacity``),
)`
  width: 120px;
  height: 140px;

  background-color: ${(props) => (props.$selected ? "#ffd166" : "#fffdf0")};

  border-radius: 22px;
  overflow: hidden;
`;

const CardText = styled.Text`
  color: #263f40;

  font-size: ${(props) => (props.$type === "zh" ? "24px" : "16px")};

  line-height: ${(props) => (props.$type === "zh" ? "31px" : "21px")};

  font-weight: bold;
  text-align: center;

  flex-shrink: 1;
`;

const BottomArea = styled.View`
  height: 38px;

  flex-direction: row;

  background-color: #f2ead7;

  border-bottom-left-radius: 22px;
  border-bottom-right-radius: 22px;
`;

const PinyinButton = styled.TouchableOpacity`
  flex: 1;

  justify-content: center;
  align-items: center;

  padding-horizontal: 4px;
`;

const SoundButton = styled.TouchableOpacity`
  width: 42px;

  justify-content: center;
  align-items: center;

  border-left-width: 1px;
  border-left-color: #ded4bf;
`;

const PinyinText = styled.Text`
  color: #e75345;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
`;

const PinyinHint = styled.Text`
  color: #999;
  font-size: 12px;
  font-weight: bold;
`;

const SoundText = styled.Text`
  color: #2479b5;
  font-size: 12px;
  font-weight: bold;
`;

const MainArea = styled.View`
  flex: 1;
  position: relative;

  justify-content: center;
  align-items: center;

  padding: 12px 9px;
`;

const MarkButton = styled.TouchableOpacity`
  position: absolute;
  top: 6px;
  right: 6px;

  padding: 5px;
  z-index: 10;
`;

const MarkText = styled.Text`
  font-size: 29px;
  color: #f2b705;
`;
