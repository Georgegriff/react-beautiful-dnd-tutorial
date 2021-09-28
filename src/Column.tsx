import React from "react";
import { ColumnData, Task as ITask } from "./initial-data";
import styled from "styled-components";
import { Task } from "./Task";
import { Droppable } from "react-beautiful-dnd";

const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 2px;
  display: flex;
  flex-direction: column;
`;
const Title = styled.h3`
  padding: 8px;
`;

interface TaskListProps {
  readonly isDraggingOver: boolean;
}

const TaskList = styled.div<TaskListProps>`
  padding: 8px;
  transition: background-color 0.2s ease;
  background: ${({ isDraggingOver }) => (isDraggingOver ? "skyblue" : "white")};
  flex-grow: 1;
  min-height: 100px;
`;

interface IColumnProps {
  column: ColumnData;
  tasks: ITask[];
  isDropDisabled?: boolean;
}

export const Column: React.FC<IColumnProps> = ({
  column,
  tasks,
  isDropDisabled,
}) => {
  return (
    <Container>
      <Title>{column.title}</Title>
      <Droppable
        droppableId={column.id}
        // type={column.id === "column-3" ? "done" : "active"}
        isDropDisabled={isDropDisabled}
      >
        {(provided, snapshot) => (
          <TaskList
            isDraggingOver={snapshot.isDraggingOver}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {tasks.map((task, index) => {
              return <Task key={task.id} task={task} index={index} />;
            })}
            {provided.placeholder}
          </TaskList>
        )}
      </Droppable>
    </Container>
  );
};
