// Todo.tsx
import { useMutation, useQuery } from '@apollo/client';
import { gql } from 'graphql.macro';
import React from 'react'
import { useEffect, useState, useCallback } from "react";
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../app/reducers/userSlice';
import DeleteModal from '../../../components/DeleteModal/DeleteModal';
import Loading from '../../../components/Loading/Loading';
import './Todo.css'

const ALL_TODO_QUERY = gql`
query allTodo($filter: TodoFilter) {
    allTodo(filter: $filter) {
      id
      title,
      completed
    }
  }`

const CREATE_MUTATION = gql`
    mutation CreateTodo($title: String!, $completed:Boolean) {
    createTodo(title: $title, completed: $completed) {
        id
        title,
        completed
    }
}`

const UPDATE_MUTATION = gql`
    mutation UpdateTodo($id: ID!, $completed: Boolean) {
    updateTodo(id: $id, completed: $completed) {
        id
        title,
        completed
    }
}`

const REMOVE_MUTATION = gql`
    mutation RemoveTodo($id: ID!) {
    removeTodo(id: $id) {
        id
    }
}`

export function Todo() {
    const user = useSelector(selectUser) || { id: null }
    const [tasksRemaining, setTasksRemaining] = useState(0);
    const [tasks, setTasks] = useState([] as any[]);
    const [itemForRemove, setItemForRemove] = useState<any | null>(null)

    const { data, loading } = useQuery(ALL_TODO_QUERY, {
        onCompleted: (data) => {
            setTasks(data?.allTodo?.map((d: any) => ({ ...d })) || [])
        },
        skip: !user.id,
        variables: {
            filter: {
                user_every: { id: user.id },
            },
        }
    })

    const [createTodo, { error: createError }] = useMutation(CREATE_MUTATION)
    const [updateTodo, { error: updateError }] = useMutation(UPDATE_MUTATION)
    const [removeTodo, { error: removeError }] = useMutation(REMOVE_MUTATION)

    useEffect(() => {
        setTasksRemaining(tasks.filter(task => !task.completed).length)
    }, [tasks]);

    const addTask = async (title: string) => {
        const createdData = await createTodo({ variables: { title, completed: false } }) as any
        console.log('createdData', createdData)
        const newTasks = [...tasks, createdData.data.createTodo];
        setTasks(newTasks)
    };

    const completeTask = (index: number) => {
        updateTodo({ variables: { id: tasks[index].id, completed: true } })
        const newTasks = [...tasks];
        newTasks[index].completed = true;
        setTasks(newTasks);
    };

    const removeTask = useCallback((index: number) => {
        setItemForRemove({ id: tasks[index].id, name: tasks[index].title, index })
    }, [tasks]);

    const doRemoveTask = useCallback(() => {
        if (itemForRemove != null) {
            const newTasks = [...tasks];
            newTasks.splice(itemForRemove.index, 1);
            setTasks(newTasks);
            setItemForRemove(null)
            removeTodo({ variables: { id: tasks[itemForRemove.index].id } })
        }
    }, [tasks, itemForRemove]);

    if (loading) return <Loading />

    return (
        <div className="todo-container">
            <h1>Tasks</h1>
            <div className="tasks">
                {tasks.map((task, index) => (
                    <Task
                        task={task}
                        index={index}
                        completeTask={completeTask}
                        removeTask={removeTask}
                        key={index}
                    />
                ))}
            </div>
            <div className="create-task" >
                <CreateTask addTask={addTask} />
                <div className="header">Pending tasks ({tasksRemaining})</div>
            </div>

            <DeleteModal
                show={!!itemForRemove}
                deleteObject={itemForRemove}
                modelName={'Todo'}
                onHide={() => setItemForRemove(null)}
                onDelete={doRemoveTask} />
        </div>
    );
}

function CreateTask({ addTask }: any) {
    const [value, setValue] = useState("");

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (!value) return;

        addTask(value);
        setValue("");
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                className="input"
                value={value}
                placeholder="Add a new task"
                onChange={e => setValue(e.target.value)}
            />
        </form>
    );
}

function Task({ task, index, completeTask, removeTask }: any) {
    return (
        <div
            className="task"
            style={{ textDecoration: task.completed ? "line-through" : "" }}
        >
            <div><Button variant={'danger'} size={'sm'} onClick={() => removeTask(index)}>x</Button></div>
            <div className='title'>{task.title}</div>
            <div className='right'>
                <Button onClick={() => completeTask(index)}>Complete</Button>
            </div>
        </div>
    );
}
