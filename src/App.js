import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const students = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    phone: "123456789"
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Doe",
    phone: "987654321"
  }
]

const statusesFromBackend =
  {
    ["1"]: {
      name: "Active",
      students: students
    },
    ["2"]: {
      name: "Delinquent",
      students: []
    },
    ["3"]: {
      name: "Dropped",
      students: []
    }
  }

const onDragEnd = (result, statuses, setStatuses) => {
  if(!result.destination) return;
  const { source, destination } = result;
  if(source.droppableId !== destination.droppableId) {
    const sourceStatus = statuses[source.droppableId];
    const destStatus = statuses[destination.droppableId];
    const sourceStudents = [...sourceStatus.students];
    const destStudents = [...destStatus.students];
    const [removed] = sourceStudents.splice(source.index, 1);
    destStudents.splice(destination.index, 0, removed);
    setStatuses({
      ...statuses,
      [source.droppableId]: {
        ...sourceStatus,
        students: sourceStudents
      },
      [destination.droppableId]: {
        ...destStatus,
        students: destStudents
      }
    })
  } else {
    const status = statuses[source.droppableId];
    const copiedStudents = [...status.students];
    const [removed] = copiedStudents.splice(source.index, 1);
    copiedStudents.splice(destination.index, 0, removed);
    setStatuses({
      ...statuses,
      [source.droppableId]: {
        ...status,
        students: copiedStudents
      }
    });
  }
};

function App() {
  const [statuses, setStatuses] = useState(statusesFromBackend);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', height: '100%' }}>
      <DragDropContext onDragEnd={result => onDragEnd(result, statuses, setStatuses)}>
        {Object.entries(statuses).map(([id, status]) => {
          return (
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <h2>{status.name}</h2>
              <div style={{margin: 8}}>

                <Droppable key={id} droppableId={id}>
                  {(provided, snapshot) => {
                    return (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{
                          background: snapshot.isDraggingOver ? 'lightblue' : 'lightgrey',
                          padding: 4,
                          width: 250,
                          minHeight: 500
                        }}
                      >
                        {status.students.map((student, index) => {
                          return (
                            <Draggable key={student.id} draggableId={student.id} index={index}>
                              {(provided, snapshot) => {
                                return (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={{
                                      userSelect: 'none',
                                      padding: 16,
                                      margin: '0 0 8px 0',
                                      minHeight: '50px',
                                      backgroundColor: snapshot.isDragging ? '#263B4A' : '#456C86',
                                      color: 'white',
                                      ...provided.draggableProps.style
                                    }}
                                  >
                                    {student.firstName}
                                  </div>
                                )
                              }}
                            </Draggable>
                          )
                        })}
                        {provided.placeholder}
                      </div>
                    )
                  }}
                </Droppable>
              </div>
            </div>
          )
        })}
      </DragDropContext>
    </div>
  );
}

export default App;
