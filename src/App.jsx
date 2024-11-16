import React, { useEffect, useState } from "react";

const App = () => {
  const [records, setRecords] = useState([
    { title: "勉強の記録1", time: 1},
    { title: "勉強の記録2", time: 2},
    { title: "勉強の記録3", time: 3}
  ]);

  const [studyContent, setStudyContent] = useState("");
  const [studyTime, setStudyTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [inputError, setInputError] = useState(false);

  useEffect(() => {
    const newTotalTime = records.reduce((sum, record) => sum + record.time, 0);
    setTotalTime(newTotalTime);
  }, [records]);

  const onChangeStudyContent = (event) => {
    setStudyContent(event.target.value);
  }

  const onChangeStudyTime = (event) => {
    setStudyTime(event.target.value);
  }

  const onClickAdd = () => {
    if (studyContent === "" || Number(studyTime) === 0) {
      setInputError(true);
      return;
    }
    const newRecords = { title: studyContent, time: Number(studyTime) };
    setRecords([...records, newRecords]);
    setStudyContent("");
    setStudyTime(0);
    setInputError(false);
  }

  return (
    <>
      <h1>学習記録一覧</h1>
      <ul>
        {records.map((records) => (
            <li key={records.title}>
              <p>{records.title}: {records.time}h</p>
            </li>
          )
        )}
      </ul>
      <p>学習内容</p>
      <input type="text" value={studyContent} onChange={onChangeStudyContent} />
      <p>学習時間</p>
      <input type="number" value={studyTime} onChange={onChangeStudyTime} />

      <p>入力されている学習内容: {studyContent}</p>
      <p>入力されている時間: {studyTime}時間</p>
      <button onClick={onClickAdd}>登録</button>
      {inputError && <p style={{ color: "red" }}>入力されていない項目があります</p>}
      <p>合計時間：{totalTime}(h)</p>
    </>
  );
};
  
export default App;
  