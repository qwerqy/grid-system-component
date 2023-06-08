import React from "react";
import { Grid } from "./components/Grid";
import styled from "styled-components";

const areas = [
  { name: "header", start: [0, 0], end: [12, 0] },
  { name: "sidebar", start: [0, 1], end: [1, 10] },
  { name: "content", start: [2, 1], end: [12, 11] },
  { name: "footer", start: [0, 11], end: [12, 11] },
];

const innerAreas = [
  { name: "content1", start: [0, 0], end: [8, 11] },
  { name: "content2", start: [9, 0], end: [12, 11] },
];

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: #fff8f0;
`;

const Canvas = styled.div`
  height: 600px;
  width: 800px;
  border-radius: 8px;
`;

const Cell = styled.div<{
  gridArea?: string;
  backgroundColor?: string;
  height?: string;
}>`
  background-color: ${(props) => props.backgroundColor};
  grid-area: ${(props) => props.gridArea};
  height: ${(props) => props.height};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const App: React.FC = () => {
  return (
    <Wrapper>
      <Canvas>
        <Grid areas={areas} columns={12} rows={12}>
          <Cell gridArea={"header"} backgroundColor={"#FFC9B5"}>
            Header
          </Cell>
          <Cell gridArea={"content"} backgroundColor={"#DDE1E4"}>
            <Grid areas={innerAreas}>
              <Cell gridArea={"content1"} backgroundColor={"#D8AA96"}>
                Content 1
              </Cell>
              <Cell gridArea={"content2"} backgroundColor={"#807182"}>
                Inner Sidebar
              </Cell>
            </Grid>
          </Cell>
          <Cell gridArea={"sidebar"} backgroundColor={"#F7B1AB"}>
            Sidebar
          </Cell>
          <Cell gridArea={"footer"} backgroundColor={"#FFC9B5"}>
            Footer
          </Cell>
        </Grid>
      </Canvas>
    </Wrapper>
  );
};

export default App;
