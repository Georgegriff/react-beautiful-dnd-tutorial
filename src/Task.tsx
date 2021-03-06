import React from "react";
import { Task as ITask } from "./initial-data";
import styled from "styled-components";
import { Draggable } from "react-beautiful-dnd";

interface ContainerProps {
  readonly isDragging: boolean;
  readonly disabled: boolean;
}

const Container = styled.div<ContainerProps>`
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 8px;
  color: ${({ disabled }) => (disabled ? "grey" : "initial")};
  background: ${(props) =>
    props.disabled ? "lightgrey" : props.isDragging ? "lightgreen" : "white"};
  display: flex;
  align-items: center;
`;

interface HandleProps {
  readonly disabled: boolean;
}

const Handle = styled.div<HandleProps>`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: solid 2px transparent;
  font-family: inherit;
  margin-right: 8px;
  background: ${({ disabled }) => (disabled ? "grey" : "orange")};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "initial")};
  &:focus:not([disabled]),
  &:hover:not([disabled]) {
    outline: none;
    border-color: skyblue;
  }
`;

interface ITaskProps {
  task: ITask;
  index: number;
}

export const Task: React.FC<ITaskProps> = ({ task, index }) => {
  const isDragDisabled = task.id === "task-1";
  return (
    <Draggable
      draggableId={task.id}
      index={index}
      isDragDisabled={isDragDisabled}
    >
      {(provided, snapshot) => {
        return (
          <Container
            ref={provided.innerRef}
            {...provided.draggableProps}
            isDragging={snapshot.isDragging}
            disabled={isDragDisabled}
          >
            <Handle disabled={isDragDisabled} {...provided.dragHandleProps} />
            {task.content}
          </Container>
        );
      }}
    </Draggable>
  );
};
