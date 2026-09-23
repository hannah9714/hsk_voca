import styled from "styled-components/native";

export default function Header() {
  return (
    <HeaderContainer>
      {/* <BackButton>‹</BackButton> */}

      <Title>Quiz</Title>
    </HeaderContainer>
  );
}

const HeaderContainer = styled.View`
  height: 50px;
  background-color: #4aa7ea;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 25px;
`;

// const BackButton = styled.Text`
//   color: white;
//   font-size: 45px;
// `;

const Title = styled.Text`
  color: white;
  font-size: 26px;
  font-weight: bold;
`;
