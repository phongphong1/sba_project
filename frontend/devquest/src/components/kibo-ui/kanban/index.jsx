"use client"

import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { createContext, useContext, useMemo, useState } from "react"
import { createPortal } from "react-dom"
import tunnel from "tunnel-rat"
import { Card } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

const Tunnel = tunnel()

const KanbanContext = createContext({
  columns: [],
  data: [],
  activeCardId: null,
  activeColumnId: null,
})

const KanbanColumnContext = createContext({
  attributes: {},
  listeners: undefined,
})

const KanbanCardContext = createContext({
  attributes: {},
  listeners: undefined,
})

export const KanbanBoard = ({ id, children, className, sortable = false }) => {
  const { isOver, setNodeRef } = useDroppable({
    id,
  })
  const sortableState = useSortable({
    id,
    data: {
      type: "column",
    },
    disabled: !sortable,
  })

  const style = sortable
    ? {
      transition: sortableState.transition,
      transform: CSS.Transform.toString(sortableState.transform),
    }
    : undefined

  const columnContextValue = useMemo(
    () => ({
      attributes: sortable ? sortableState.attributes : {},
      listeners: sortable ? sortableState.listeners : undefined,
    }),
    [sortable, sortableState.attributes, sortableState.listeners]
  )

  return (
    <KanbanColumnContext.Provider value={columnContextValue}>
      <div
        className={cn(
          "flex min-h-40 flex-col divide-y overflow-hidden rounded-md border bg-secondary text-xs shadow-sm ring-2 transition-all",
          isOver ? "ring-primary" : "ring-transparent",
          sortable && sortableState.isDragging && "opacity-70 shadow-lg",
          className
        )}
        ref={(node) => {
          setNodeRef(node)
          if (sortable) {
            sortableState.setNodeRef(node)
          }
        }}
        style={style}
      >
        {children}
      </div>
    </KanbanColumnContext.Provider>
  )
}

export const KanbanCard = ({ id, name, children, className, dragHandle = false }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transition,
    transform,
    isDragging,
  } = useSortable({
    id,
    data: {
      type: "card",
    },
  })
  const { activeCardId } = useContext(KanbanContext)

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  }

  const cardContextValue = useMemo(
    () => ({
      attributes,
      listeners,
    }),
    [attributes, listeners]
  )

  return (
    <>
      <div
        style={style}
        {...(dragHandle ? {} : listeners)}
        {...(dragHandle ? {} : attributes)}
        ref={setNodeRef}
      >
        <KanbanCardContext.Provider value={cardContextValue}>
          <Card
            className={cn(
              "gap-4 rounded-md p-3 shadow-sm",
              dragHandle && "cursor-grab",
              isDragging && "pointer-events-none cursor-grabbing opacity-30",
              className
            )}
          >
            {children ?? <p className="m-0 font-medium text-sm">{name}</p>}
          </Card>
        </KanbanCardContext.Provider>
      </div>
      {activeCardId === id && (
        <Tunnel.In>
          <Card
            className={cn(
              "cursor-grab gap-4 rounded-md p-3 shadow-sm ring-2 ring-primary",
              isDragging && "cursor-grabbing",
              className
            )}
          >
            {children ?? <p className="m-0 font-medium text-sm">{name}</p>}
          </Card>
        </Tunnel.In>
      )}
    </>
  )
}

export const KanbanCardDragHandle = ({ className, ...props }) => {
  const card = useContext(KanbanCardContext)

  return (
    <div
      className={cn("cursor-grab touch-none active:cursor-grabbing", className)}
      {...card.attributes}
      {...card.listeners}
      {...props}
    />
  )
}

export const KanbanCards = ({ children, className, ...props }) => {
  const { data } = useContext(KanbanContext)
  const filteredData = data.filter((item) => item.column === props.id)
  const items = filteredData.map((item) => item.id)

  return (
    <ScrollArea className="overflow-hidden">
      <SortableContext items={items}>
        <div className={cn("flex flex-grow flex-col gap-2 p-2", className)} {...props}>
          {filteredData.map(children)}
        </div>
      </SortableContext>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  )
}

export const KanbanHeader = ({ className, dragHandle = false, ...props }) => {
  const column = useContext(KanbanColumnContext)

  return (
    <div
      className={cn(
        "m-0 p-2 font-semibold text-sm",
        dragHandle && "cursor-grab active:cursor-grabbing",
        className
      )}
      {...(dragHandle ? column.attributes : {})}
      {...(dragHandle ? column.listeners : {})}
      {...props}
    />
  )
}

export const KanbanDragHandle = ({ className, ...props }) => {
  const column = useContext(KanbanColumnContext)

  return (
    <div
      className={cn("cursor-grab active:cursor-grabbing", className)}
      {...column.attributes}
      {...column.listeners}
      {...props}
    />
  )
}

export const KanbanProvider = ({
  children,
  onDragStart,
  onDragEnd,
  onDragOver,
  onColumnsChange,
  className,
  columns,
  data,
  onDataChange,
  ...props
}) => {
  const [activeCardId, setActiveCardId] = useState(null)
  const [activeColumnId, setActiveColumnId] = useState(null)

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor)
  )

  const handleDragStart = (event) => {
    const activeType = event.active.data.current?.type

    if (activeType === "column") {
      setActiveColumnId(event.active.id)
    }

    if (activeType === "card") {
      setActiveCardId(event.active.id)
    }

    onDragStart?.(event)
  }

  const handleDragOver = (event) => {
    const { active, over } = event

    if (!over || active.data.current?.type === "column") {
      return
    }

    const activeItem = data.find((item) => item.id === active.id)
    const overItem = data.find((item) => item.id === over.id)

    if (!activeItem) {
      return
    }

    const activeColumn = activeItem.column
    const overColumn =
      overItem?.column ||
      columns.find((column) => column.id === over.id)?.id ||
      columns[0]?.id

    if (activeColumn !== overColumn) {
      let newData = [...data]
      const activeIndex = newData.findIndex((item) => item.id === active.id)
      const overIndex = newData.findIndex((item) => item.id === over.id)

      newData[activeIndex].column = overColumn
      newData = arrayMove(newData, activeIndex, overIndex)

      onDataChange?.(newData)
    }

    onDragOver?.(event)
  }

  const handleDragEnd = (event) => {
    setActiveCardId(null)
    setActiveColumnId(null)

    onDragEnd?.(event)

    const { active, over } = event

    if (!over || active.id === over.id) {
      return
    }

    if (active.data.current?.type === "column") {
      const oldIndex = columns.findIndex((column) => column.id === active.id)
      const overColumnId =
        columns.find((column) => column.id === over.id)?.id ||
        data.find((item) => item.id === over.id)?.column
      const newIndex = columns.findIndex((column) => column.id === overColumnId)

      if (oldIndex === -1 || newIndex === -1) {
        return
      }

      onColumnsChange?.(arrayMove([...columns], oldIndex, newIndex))
      return
    }

    let newData = [...data]
    const oldIndex = newData.findIndex((item) => item.id === active.id)
    const newIndex = newData.findIndex((item) => item.id === over.id)

    newData = arrayMove(newData, oldIndex, newIndex)
    onDataChange?.(newData)
  }

  const announcements = {
    onDragStart({ active }) {
      if (active.data.current?.type === "column") {
        const column = columns.find((item) => item.id === active.id)
        return `Picked up the column "${column?.name}"`
      }

      const { name, column } = data.find((item) => item.id === active.id) ?? {}
      return `Picked up the card "${name}" from the "${column}" column`
    },
    onDragOver({ active, over }) {
      if (active.data.current?.type === "column") {
        const overColumnId =
          columns.find((column) => column.id === over?.id)?.id ||
          data.find((item) => item.id === over?.id)?.column
        const newColumn = columns.find((column) => column.id === overColumnId)?.name
        return `Dragged the column over "${newColumn}"`
      }

      const { name } = data.find((item) => item.id === active.id) ?? {}
      const newColumn = columns.find((column) => column.id === over?.id)?.name
      return `Dragged the card "${name}" over the "${newColumn}" column`
    },
    onDragEnd({ active, over }) {
      if (active.data.current?.type === "column") {
        const column = columns.find((item) => item.id === active.id)
        const overColumnId =
          columns.find((item) => item.id === over?.id)?.id ||
          data.find((item) => item.id === over?.id)?.column
        const newColumn = columns.find((item) => item.id === overColumnId)
        return `Dropped the column "${column?.name}" near "${newColumn?.name}"`
      }

      const { name } = data.find((item) => item.id === active.id) ?? {}
      const newColumn = columns.find((column) => column.id === over?.id)?.name
      return `Dropped the card "${name}" into the "${newColumn}" column`
    },
    onDragCancel({ active }) {
      if (active.data.current?.type === "column") {
        const column = columns.find((item) => item.id === active.id)
        return `Cancelled dragging the column "${column?.name}"`
      }

      const { name } = data.find((item) => item.id === active.id) ?? {}
      return `Cancelled dragging the card "${name}"`
    },
  }

  return (
    <KanbanContext.Provider value={{ columns, data, activeCardId, activeColumnId }}>
      <DndContext
        accessibility={{ announcements }}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragStart={handleDragStart}
        sensors={sensors}
        {...props}
      >
        <SortableContext items={columns.map((column) => column.id)}>
          <div className={cn("grid w-max auto-cols-fr grid-flow-col gap-4", className)}>
            {columns.map((column) => children(column))}
          </div>
        </SortableContext>
        {typeof window !== "undefined" &&
          createPortal(
            <DragOverlay>{activeCardId ? <Tunnel.Out /> : null}</DragOverlay>,
            document.body
          )}
      </DndContext>
    </KanbanContext.Provider>
  )
}
