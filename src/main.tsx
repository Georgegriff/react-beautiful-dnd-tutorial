import React, { useCallback, useState } from "react";
import ReactDOM from "react-dom";
import { Column } from "./Column";
import { ColumnData, initialData, Task as ITask } from "./initial-data";
import {
  DragDropContext,
  DragStart,
  DragUpdate,
  Droppable,
  DropResult,
  ResponderProvided,
} from "react-beautiful-dnd";
import styled from "styled-components";
import "@atlaskit/css-reset";

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  & > * {
    width: 250px;
  }
`;

interface InnerListProps {
  taskMap: Record<string, ITask>;
  index: number;
  column: ColumnData;
}

const InnerList: React.FC<InnerListProps> = React.memo(
  ({ column, taskMap, index }) => {
    const tasks = column.taskIds.map((taskId) => {
      return taskMap[taskId];
    });
    // prevent moving backwards
    return (
      <Column index={index} key={column.id} column={column} tasks={tasks} />
    );
  }
);

// const InnerList: React.FC<InnerListProps> = ({ column, taskMap, index }) => {
//   const tasks = column.taskIds.map((taskId) => {
//     return taskMap[taskId];
//   });
//   // prevent moving backwards
//   return <Column index={index} key={column.id} column={column} tasks={tasks} />;
// };

const App = () => {
  const [taskData, setTaskData] = useState(initialData);
  const [homeIndex, setHomeIndex] = useState<number | null>(null);

  const onDragStart = useCallback(
    (start: DragStart, provided: ResponderProvided) => {
      const { announce } = provided;
      announce(
        `You have lifted the task in position ${start.source.index + 1}, bro.`
      );
      const newHomeIndex = taskData.columnOrder.indexOf(
        start.source.droppableId
      );
      // document.body.style.color = "orange";
      // document.body.style.transition = "background-color 0.2s ease";

      setHomeIndex(newHomeIndex);
    },
    []
  );

  // const onDragUpdate = useCallback((update: DragUpdate) => {
  //   const { destination } = update;
  //   const opacity = destination
  //     ? destination.index / Object.keys(taskData.tasks).length
  //     : 0;

  //   document.body.style.backgroundColor = `rgba(153, 141, 217, ${opacity})`;
  // }, []);

  const onDragEnd = useCallback(
    (result: DropResult, provided: ResponderProvided) => {
      //    document.body.style.color = "initial";
      //    document.body.style.backgroundColor = "initial";
      setHomeIndex(null);
      const { destination, source, draggableId, type } = result;

      // dropped outside
      if (!destination) {
        return;
      }

      // dropped back to original location
      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      ) {
        return;
      }

      if (type === "column") {
        const newColumnOrder = Array.from(taskData.columnOrder);
        newColumnOrder.splice(source.index, 1);
        newColumnOrder.splice(destination.index, 0, draggableId);
        setTaskData({
          ...taskData,
          columnOrder: newColumnOrder,
        });
        return;
      }

      const start = taskData.columns[source.droppableId];
      const end = taskData.columns[destination.droppableId];

      if (start === end) {
        const newTasksId = Array.from(start.taskIds);

        // remove item from index
        newTasksId.splice(source.index, 1);
        // remove 0 add draggableId
        newTasksId.splice(destination.index, 0, draggableId);

        const newColumn = {
          ...start,
          taskIds: newTasksId,
        } as ColumnData;

        setTaskData({
          ...taskData,
          columns: {
            ...taskData.columns,
            [newColumn.id]: newColumn,
          },
        });
        return;
      }

      // moving from one column to another
      const startTaskIds = Array.from(start.taskIds);
      const endTaskIds = Array.from(end.taskIds);

      startTaskIds.splice(source.index, 1);

      // remove 0 add draggableId
      endTaskIds.splice(destination.index, 0, draggableId);

      const newStartColumn = {
        ...start,
        taskIds: startTaskIds,
      } as ColumnData;

      const newEndColumn = {
        ...end,
        taskIds: endTaskIds,
      } as ColumnData;

      setTaskData({
        ...taskData,
        columns: {
          ...taskData.columns,
          [newStartColumn.id]: newStartColumn,
          [newEndColumn.id]: newEndColumn,
        },
      });
    },
    [taskData]
  );

  return (
    <DragDropContext
      onDragStart={onDragStart}
      // onDragUpdate={onDragUpdate}
      onDragEnd={onDragEnd}
    >
      <Droppable droppableId="all-columns" direction="horizontal" type="column">
        {(provided) => (
          <Container ref={provided.innerRef} {...provided.droppableProps}>
            {taskData.columnOrder.map((columnId, index) => {
              const column = taskData.columns[columnId];
              return (
                <InnerList
                  key={columnId}
                  column={column}
                  taskMap={taskData.tasks}
                  index={index}
                />
              );
            })}
            {provided.placeholder}
          </Container>
        )}
      </Droppable>
    </DragDropContext>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
