import React, { useEffect, useState, useCallback } from "react";
import supabase from "./supabaseClient";

const App = () => {

  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [studyContent, setStudyContent] = useState("");
  const [studyTime, setStudyTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [inputError, setInputError] = useState(false);

  useEffect(() => {
    const newTotalTime = records.reduce((sum, record) => sum + record.time, 0);
    setTotalTime(newTotalTime);
  }, [records]);

  const fetchRecords = useCallback(async () => {
    try {
      const { data, error } = await supabase.from("study-record").select("*");
      if (error) {
        console.error("エラーが発生しました", error.message);
      } 
      setRecords(data);
    } catch (error) {
        return;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const onChangeStudyContent = (event) => {
    setStudyContent(event.target.value);
  }

  const onChangeStudyTime = (event) => {
    setStudyTime(event.target.value);
  }

  const onClickAdd = async () => {
    if (studyContent === "" || Number(studyTime) === 0) {
      setInputError(true);
      return;
    }
    const newRecords = { title: studyContent, time: Number(studyTime) };
    const { error } = await supabase.from("study-record").insert(newRecords);
    if (error) {
      console.error("エラーが発生しました", error.message);
      return;
    }
    setStudyContent("");
    setStudyTime(0);
    setInputError(false);
    fetchRecords();
  }

  const onClickDelete = async (id) => {
    const { error } = await supabase.from("study-record").delete().eq("id", id);
    if (error) {
      console.error("エラーが発生しました", error.message);
      return;
    }
    fetchRecords();
  }

  return (
    <>
      <h1>学習記録一覧</h1>
      {isLoading && <p>Loading...</p>}
      <ul>
        {records.map((record) => (
            <li data-testid="studyRecord" key={record.id} style={{ display: "flex", alignItems: "center" }}>
              <p data-testid="studyData">{record.title}: {record.time}h</p>
              <button data-testid="deleteStudyData" onClick={() => onClickDelete(record.id)}>削除</button>
            </li>
          )
        )}
      </ul>
      <div style={{ display: "flex", alignItems: "center" }}>
        <label htmlFor="studyContent">学習内容</label>
        <input id="studyContent" data-testid="studyContent" type="text" value={studyContent} onChange={onChangeStudyContent} />
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <label htmlFor="studyTime">学習時間</label>
        <input id="studyTime" data-testid="studyTime" type="number" value={studyTime} onChange={onChangeStudyTime} />
        <p>時間</p>
      </div>
      
      <p>入力されている学習内容: {studyContent}</p>
      <p>入力されている時間: {studyTime}時間</p>
      <button data-testid="addStudyData" onClick={onClickAdd}>登録</button>
      {inputError && <p data-testid="inputDataIsNull" style={{ color: "red" }}>入力されていない項目があります</p>}
      <p>合計時間：{totalTime}(h)</p>
    </>
  );
};
  
export default App;
  