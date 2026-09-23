import { Animated } from "react-native";
import styled from "styled-components/native";

export default function QuizCard({
  word,
  type,
  selected,
  style,
  onPress,
  showPinyin,
  onTogglePinyin,
}) {
  return (
    <Card selected={selected} style={style} onPress={onPress}>
      {type === "zh" ? (
        <CardText type="zh">{word.zh}</CardText>
      ) : (
        <CardTextContainer>
          <CardText type="ko">{word.ko}</CardText>

          <PinyinButton
            onPress={(e) => {
              e.stopPropagation();
              onTogglePinyin();
            }}
          >
            {showPinyin ? (
              <PinyinText>{word.pinyin}</PinyinText>
            ) : (
              <PinyinHint>발음</PinyinHint>
            )}
          </PinyinButton>
        </CardTextContainer>
      )}
    </Card>
  );
}

const Card = styled(
  Animated.createAnimatedComponent(styled.TouchableOpacity``),
)`
  width: 120px;
  height: 100px;
  background-color: ${(props) => (props.selected ? "#ffd166" : "#fffdf0")};
  border-radius: 22px;
  justify-content: center;
  align-items: center;
`;

const CardTextContainer = styled.View`
  flex: 1;
  justify-content: space-between;
  padding-top: 30px;
`;

const CardText = styled.Text`
  color: #263f40;
  font-size: ${(props) => (props.type === "ko" ? "17px" : "22px")};
  font-weight: bold;
  text-align: center;
`;

const PinyinButton = styled.TouchableOpacity`
  width: 120px;
  height: 32px;
  border-bottom-left-radius: 22px;
  border-bottom-right-radius: 22px;
  background-color: #f2ead7;
  justify-content: center;
  align-items: center;
`;

const PinyinText = styled.Text`
  color: #e75345;
  font-size: 12px;
  font-weight: bold;
`;

const PinyinHint = styled.Text`
  color: #999;
  font-size: 12px;
  font-weight: bold;
`;
