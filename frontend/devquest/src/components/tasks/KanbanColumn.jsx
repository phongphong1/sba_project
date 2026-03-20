import { Draggable, Droppable } from '@hello-pangea/dnd'
import { MoreHorizontal } from 'lucide-react'
import TaskCard from '@/components/tasks/TaskCard'
import { Button } from '@/components/ui/button'

export default function KanbanColumn({ column, columnIndex, tasks, onTaskClick }) {
  return (
    <Draggable draggableId={column.id} index={columnIndex}>
      {(columnProvided, columnSnapshot) => (
        <section
          ref={columnProvided.innerRef}
          {...columnProvided.draggableProps}
          style={columnProvided.draggableProps.style}
          className={`flex h-full w-[320px] shrink-0 flex-col rounded-[24px] bg-slate-100/70 p-4 transition ${
            columnSnapshot.isDragging ? 'rotate-[1deg] shadow-xl shadow-slate-300/60' : ''
          }`}
        >
          <div
            {...columnProvided.dragHandleProps}
            className="mb-4 flex cursor-grab items-center justify-between gap-3 px-1 active:cursor-grabbing"
          >
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                {column.title}
              </h3>
              <p className="mt-1 text-sm font-semibold text-slate-900">{tasks.length} tasks</p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-[16px] border-slate-200 bg-white text-slate-400 shadow-sm hover:bg-slate-50 hover:text-slate-700"
              aria-label={`Column actions for ${column.title}`}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>

          <Droppable droppableId={column.id} type="TASK">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`flex min-h-[240px] flex-1 flex-col gap-4 rounded-[20px] transition ${
                  snapshot.isDraggingOver ? 'bg-indigo-100/60' : ''
                }`}
              >
                {tasks.map((task, index) => (
                  <Draggable
                    key={task.id}
                    draggableId={task.id}
                    index={index}
                    disableInteractiveElementBlocking
                  >
                    {(draggableProvided, snapshot) => (
                      <div
                        ref={draggableProvided.innerRef}
                        {...draggableProvided.draggableProps}
                        style={draggableProvided.draggableProps.style}
                        className={`select-none ${snapshot.isDragging ? 'rotate-[1deg]' : ''}`}
                      >
                        <TaskCard
                          task={task}
                          dragHandleProps={draggableProvided.dragHandleProps}
                          onClick={() => onTaskClick(task.id)}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </section>
      )}
    </Draggable>
  )
}
