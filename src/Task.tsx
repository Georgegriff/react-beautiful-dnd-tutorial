import React from "react";
import { Task as ITask } from "./initial-data";
import styled from "styled-components";
import { Draggable } from "react-beautiful-dnd";

interface ContainerProps {
  readonly isDragging: boolean;
}

const Container = styled.div<ContainerProps>`
  border: 1px solid lightgrey;
  border-radius: 2px;
  margin-right: 8px;
  background: ${(props) => (props.isDragging ? "lightgreen" : "white")};
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: solid 1px lightgrey;

  &:focus,
  &:hover {
    border-color: orange;
  }
`;

interface ITaskProps {
  task: ITask;
  index: number;
}

export const Task: React.FC<ITaskProps> = ({ task, index }) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => {
        return (
          <Container
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            isDragging={snapshot.isDragging}
          >
            {task.content[0]}
          </Container>
        );
      }}
    </Draggable>
  );
};
