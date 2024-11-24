import React from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from '../App';

// 第一引数にテスト名、第二引数にテスト内容を記述
test('render title', () => {
  // render関数を利用することでAPPコンポーネントはテストの中で<body><div>タグの中に追加されて描写される
  render(<App />);
  // screenオブジェクトを利用して、学習記録一覧というテキストが存在するかどうかを確認
  const headingElement = screen.getByRole('heading', { level: 1, name: '学習記録一覧'});
  // 実際の中身を確認するために、debug()メソッドを利用して、headingElementをコンソールに出力
  // eslintでエラー扱いされるため、テスト後はコメントアウトする
  // screen.debug(headingElement);
  // toBeInTheDocument()は要素が存在するかどうかを確認するメソッド
  expect(headingElement).toBeInTheDocument();
});

describe('input test', () => {
  it('input study content are rendered', () => {
    render(<App />);
    const inputElements = screen.getByTestId('studyContent');

    fireEvent.change(inputElements, { target: { value: 'React' }});
    // screen.debug(inputElements);
    expect(inputElements.value).toBe('React');
  });

  it('input study time are rendered', () => {
    render(<App />);
    const inputElements = screen.getByTestId('studyTime');

    fireEvent.change(inputElements, { target: { value: '10' }});
    // screen.debug(inputElements);
    expect(inputElements.value).toBe('10');
  });

  it('input study time are not rendered', () => {
    render(<App />);
    const inputElements = screen.getByTestId('studyTime');

    fireEvent.change(inputElements, { target: { value: 'aaa' }});
    // screen.debug(inputElements);
    expect(inputElements.value).toBe('');
  });
});

describe('button test', () => {
  // it('input data should be remove when add button is clicked', async () => {
  //   render(<App />);
  //   const inputStudyContent = screen.getByTestId('studyContent');
  //   const inputStudyTime = screen.getByTestId('studyTime');

  //   fireEvent.change(inputStudyContent, { target: { value: 'React' }});
  //   fireEvent.change(inputStudyTime, { target: { value: '10' }});

  //   const addButton = screen.getByTestId('addStudyData');
  //   fireEvent.click(addButton);

  //   await waitFor(() => {
  //     expect(inputStudyContent.value).toBe('');
  //   });

  //   await waitFor(() => {
  //     expect(inputStudyTime.value).toBe('0');
  //   });
  // });

  it('express input error when add button is clicked', async () => {
    render(<App />);
    const inputStudyContent = screen.getByTestId('studyContent');
    const inputStudyTime = screen.getByTestId('studyTime');

    fireEvent.change(inputStudyContent, { target: { value: '' }});
    fireEvent.change(inputStudyTime, { target: { value: '0' }});

    const addButton = screen.getByTestId('addStudyData');
    fireEvent.click(addButton);

    await waitFor(() => {
      // screen.debug(screen.getByTestId('inputDataIsNull'));
      expect(screen.getByTestId('inputDataIsNull')).toBeInTheDocument();
    });
  });

  it('data should be registered and removed when add and remove button is clicked', async () => {
    render(<App />);

    // 初期状態でデータが存在しないことを確認
    expect(screen.queryByText('Sample-test: 999h')).not.toBeInTheDocument();

    // 学習内容と学習時間を入力
    const inputStudyContent = screen.getByTestId('studyContent');
    const inputStudyTime = screen.getByTestId('studyTime');
    fireEvent.change(inputStudyContent, { target: { value: 'Sample-test' }});
    fireEvent.change(inputStudyTime, { target: { value: '999' }});

    const addButton = screen.getByTestId('addStudyData');
    fireEvent.click(addButton);

    // データが登録されたことを確認
    const addedRecord = await screen.findByText('Sample-test: 999h');
    expect(addedRecord).toBeInTheDocument();

    const listRecords = screen.getAllByTestId('studyRecord');
    const testRecord = listRecords.find(record => within(record).queryByText('Sample-test: 999h'));
    // screen.debug(testRecord);
    const deleteButton = within(testRecord).getByTestId('deleteStudyData');
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.queryByText('Sample-test: 999h')).not.toBeInTheDocument();
    });
  });

});