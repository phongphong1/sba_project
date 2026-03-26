import { format, parseISO } from 'date-fns'
import { CalendarIcon, Clock3, Palette } from 'lucide-react'
import { Sketch } from '@uiw/react-color'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from '@/components/ui/drawer'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
    octomInputClass,
    octomPrimaryButtonClass,
    octomSecondaryButtonClass,
} from '@/constants/uiStyles'
import { cn } from '@/lib/utils'

const DEFAULT_TIME = '09:00'

function splitDateTime(value) {
    if (!value) {
        return {
            datePart: '',
            timePart: DEFAULT_TIME,
        }
    }

    const [datePart, rawTimePart = ''] = String(value).split('T')

    return {
        datePart,
        timePart: rawTimePart ? rawTimePart.slice(0, 5) : DEFAULT_TIME,
    }
}

function DateTimePickerField({
    id,
    label,
    value,
    onChange,
    disabled,
}) {
    const { datePart, timePart } = splitDateTime(value)
    const selectedDate = datePart ? parseISO(`${datePart}T${timePart}`) : undefined

    return (
        <div>
            <label className="mb-2 block text-sm font-medium text-slate-500" htmlFor={id}>
                {label}
            </label>

            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id={id}
                        type="button"
                        variant="outline"
                        disabled={disabled}
                        className={cn(
                            `w-full justify-between border-slate-200 bg-white ${octomInputClass}`,
                            !value ? 'text-slate-400' : 'text-slate-700',
                        )}
                    >
                        {value ? format(selectedDate, 'PPP p') : 'Select date and time'}
                        <CalendarIcon className="h-4 w-4 text-slate-400" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <div className="space-y-2 p-2">
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={(date) => {
                                if (!date) {
                                    onChange('')
                                    return
                                }

                                onChange(`${format(date, 'yyyy-MM-dd')}T${timePart || DEFAULT_TIME}`)
                            }}
                            initialFocus
                        />

                        <label className="flex items-center gap-2 rounded-[14px] border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
                            <Clock3 className="h-4 w-4 text-slate-400" />
                            <Input
                                type="time"
                                value={timePart}
                                onChange={(event) => {
                                    const nextTime = event.target.value || DEFAULT_TIME

                                    if (!datePart) {
                                        onChange(`${format(new Date(), 'yyyy-MM-dd')}T${nextTime}`)
                                        return
                                    }

                                    onChange(`${datePart}T${nextTime}`)
                                }}
                                className="h-auto border-0 bg-transparent px-0 py-0 text-sm shadow-none focus-visible:ring-0"
                                disabled={disabled}
                            />
                        </label>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default function TasksDialogsSection({
    createBoard,
    addColumn,
    createTask,
    editColumn,
}) {
    return (
        <>
            <Dialog open={createBoard.open} onOpenChange={createBoard.setOpen}>
                <DialogContent className="max-w-md rounded-[24px] border-0 bg-white p-0 shadow-2xl">
                    <DialogHeader className="px-6 pt-6">
                        <DialogTitle>Create board</DialogTitle>
                        <DialogDescription>
                            Enter a board name to start organizing columns and tasks.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="px-6 pb-2">
                        <label className="mb-2 block text-sm font-medium text-slate-500" htmlFor="createBoardName">
                            Board name
                        </label>
                        <Input
                            id="createBoardName"
                            type="text"
                            value={createBoard.value}
                            onChange={(event) => createBoard.onChange(event.target.value)}
                            placeholder="Example: Sprint 14 Delivery"
                            className={octomInputClass}
                            disabled={createBoard.loading}
                            autoFocus
                        />
                        {createBoard.error ? <p className="mt-2 text-sm text-red-500">{createBoard.error}</p> : null}
                    </div>

                    <div className="flex flex-col-reverse gap-2 rounded-b-[24px] border-t border-slate-200/80 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-end">
                        <Button
                            type="button"
                            variant="secondary"
                            className={octomSecondaryButtonClass}
                            onClick={() => createBoard.setOpen(false)}
                            disabled={createBoard.loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            className={octomPrimaryButtonClass}
                            onClick={createBoard.onSubmit}
                            disabled={createBoard.loading}
                        >
                            {createBoard.loading ? 'Creating board...' : 'Create board'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={addColumn.open} onOpenChange={addColumn.setOpen}>
                <DialogContent className="max-w-md rounded-[24px] border-0 bg-white p-0 shadow-2xl">
                    <DialogHeader className="px-6 pt-6">
                        <DialogTitle>Add column</DialogTitle>
                        <DialogDescription>
                            Enter a column name for this board workflow.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="px-6 pb-2">
                        <label className="mb-2 block text-sm font-medium text-slate-500" htmlFor="addColumnName">
                            Column name
                        </label>
                        <Input
                            id="addColumnName"
                            type="text"
                            value={addColumn.value}
                            onChange={(event) => addColumn.onChange(event.target.value)}
                            placeholder="Example: To Do"
                            className={octomInputClass}
                            autoFocus
                        />
                        {addColumn.error ? <p className="mt-2 text-sm text-red-500">{addColumn.error}</p> : null}
                    </div>

                    <div className="flex flex-col-reverse gap-2 rounded-b-[24px] border-t border-slate-200/80 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-end">
                        <Button
                            type="button"
                            variant="secondary"
                            className={octomSecondaryButtonClass}
                            onClick={() => addColumn.setOpen(false)}
                            disabled={addColumn.loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            className={octomPrimaryButtonClass}
                            onClick={addColumn.onSubmit}
                            disabled={addColumn.loading}
                        >
                            {addColumn.loading ? 'Adding column...' : 'Add column'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Drawer open={createTask.open} onOpenChange={createTask.setOpen} direction="right">
                <DrawerContent className="data-[vaul-drawer-direction=right]:!w-[min(96vw,1100px)] data-[vaul-drawer-direction=right]:!max-w-[1100px] data-[vaul-drawer-direction=right]:sm:!max-w-[1100px]">
                    <DrawerHeader className="border-b border-slate-200 px-6 py-5 text-left">
                        <DrawerTitle>Create task</DrawerTitle>
                        <DrawerDescription>
                            Fill in task details before adding this card to the selected column.
                        </DrawerDescription>
                    </DrawerHeader>

                    <div className="space-y-4 overflow-y-auto px-6 py-5">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-500" htmlFor="createTaskTitle">
                                Title
                            </label>
                            <Input
                                id="createTaskTitle"
                                type="text"
                                value={createTask.form.title}
                                onChange={(event) => createTask.onFieldChange('title', event.target.value)}
                                placeholder="Example: Define API contract"
                                className={octomInputClass}
                                disabled={createTask.loading}
                                autoFocus
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-500" htmlFor="createTaskDescription">
                                Description
                            </label>
                            <Textarea
                                id="createTaskDescription"
                                value={createTask.form.description}
                                onChange={(event) => createTask.onFieldChange('description', event.target.value)}
                                placeholder="Add context, acceptance criteria, or references..."
                                disabled={createTask.loading}
                            />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-500">Priority</label>
                                <Select
                                    value={createTask.form.priority}
                                    onValueChange={(value) => createTask.onFieldChange('priority', value)}
                                >
                                    <SelectTrigger className={`w-full ${octomInputClass}`}>
                                        <SelectValue placeholder="Select priority" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="HIGH">High</SelectItem>
                                        <SelectItem value="MEDIUM">Medium</SelectItem>
                                        <SelectItem value="LOW">Low</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-500" htmlFor="createTaskEstimateHours">
                                    Estimate hours
                                </label>
                                <Input
                                    id="createTaskEstimateHours"
                                    type="number"
                                    min="0"
                                    step="0.5"
                                    value={createTask.form.estimateHours}
                                    onChange={(event) => createTask.onFieldChange('estimateHours', event.target.value)}
                                    placeholder="8"
                                    className={octomInputClass}
                                    disabled={createTask.loading}
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-500" htmlFor="createTaskColorPicker">
                                    Color
                                </label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            id="createTaskColorPicker"
                                            type="button"
                                            variant="outline"
                                            disabled={createTask.loading}
                                            className={`w-full justify-between border-slate-200 bg-white ${octomInputClass}`}
                                        >
                                            <span className="inline-flex items-center gap-2">
                                                <span
                                                    className="h-4 w-4 rounded-full border border-slate-200"
                                                    style={{ backgroundColor: createTask.form.color }}
                                                />
                                                {createTask.form.color}
                                            </span>
                                            <Palette className="h-4 w-4 text-slate-400" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-2" align="start">
                                        <Sketch
                                            color={createTask.form.color}
                                            disableAlpha
                                            onChange={(color) => {
                                                createTask.onFieldChange('color', color.hex)
                                            }}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-500">Assignee</label>
                                <Select
                                    value={createTask.form.assigneeId}
                                    onValueChange={(value) => createTask.onFieldChange('assigneeId', value)}
                                >
                                    <SelectTrigger className={`w-full ${octomInputClass}`}>
                                        <SelectValue placeholder="Select assignee" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="UNASSIGNED">Unassigned</SelectItem>
                                        {createTask.members.map((member) => (
                                            <SelectItem key={member.id} value={String(member.id)}>
                                                {member.fullName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <DateTimePickerField
                                id="createTaskStartDate"
                                label="Start date and time"
                                value={createTask.form.startDate}
                                onChange={(value) => createTask.onFieldChange('startDate', value)}
                                disabled={createTask.loading}
                            />

                            <DateTimePickerField
                                id="createTaskDueDate"
                                label="Due date and time"
                                value={createTask.form.dueDate}
                                onChange={(value) => createTask.onFieldChange('dueDate', value)}
                                disabled={createTask.loading}
                            />
                        </div>

                        {createTask.error ? <p className="text-sm text-red-500">{createTask.error}</p> : null}
                    </div>

                    <DrawerFooter className="border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-end">
                        <Button
                            type="button"
                            variant="secondary"
                            className={octomSecondaryButtonClass}
                            onClick={() => createTask.setOpen(false)}
                            disabled={createTask.loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            className={octomPrimaryButtonClass}
                            onClick={createTask.onSubmit}
                            disabled={createTask.loading}
                        >
                            {createTask.loading ? 'Creating task...' : 'Create task'}
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>

            <Dialog open={editColumn.open} onOpenChange={editColumn.setOpen}>
                <DialogContent className="max-w-md rounded-[24px] border-0 bg-white p-0 shadow-2xl">
                    <DialogHeader className="px-6 pt-6">
                        <DialogTitle>Edit column</DialogTitle>
                        <DialogDescription>
                            Update the column name displayed on this board.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="px-6 pb-2">
                        <label className="mb-2 block text-sm font-medium text-slate-500" htmlFor="editColumnName">
                            Column name
                        </label>
                        <Input
                            id="editColumnName"
                            type="text"
                            value={editColumn.value}
                            onChange={(event) => editColumn.onChange(event.target.value)}
                            placeholder="Example: In Progress"
                            className={octomInputClass}
                            disabled={editColumn.loading}
                            autoFocus
                        />
                        {editColumn.error ? <p className="mt-2 text-sm text-red-500">{editColumn.error}</p> : null}
                    </div>

                    <div className="flex flex-col-reverse gap-2 rounded-b-[24px] border-t border-slate-200/80 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-end">
                        <Button
                            type="button"
                            variant="secondary"
                            className={octomSecondaryButtonClass}
                            onClick={() => editColumn.setOpen(false)}
                            disabled={editColumn.loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            className={octomPrimaryButtonClass}
                            onClick={editColumn.onSubmit}
                            disabled={editColumn.loading}
                        >
                            {editColumn.loading ? 'Saving...' : 'Save changes'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
