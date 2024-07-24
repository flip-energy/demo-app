'use client'

import { useState } from 'react'
import { AlertCircleIcon } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Event } from '@/flip-api/types'
import Block from '@/components/Block'
import { Switch } from '@/components/ui/switch'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import Spinner from '@/components/spinner'
import AlertDialog from '@/components/AlertDialog'
import { flip } from '@/flip'

const FormSchema = z.object({
  is_participating: z.boolean(),
  reserve_percentage: z.array(z.number().min(0).max(100)),
})

const EventForm = ({
  event,
  defaultReserve,
  setEvent,
}: {
  event: Event
  defaultReserve: number | null
  setEvent: (event: Event | null) => void
}) => {
  const [open, setOpen] = useState<boolean>(false)

  const currentReserve =
    event!.device_settings![0]!.backup_reserve_percentage || defaultReserve || 0

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      is_participating: event!.is_participating,
      reserve_percentage: [currentReserve],
    },
  })

  const shouldWarn =
    (form.getFieldState('is_participating').isDirty === true &&
      form.getValues('is_participating') === false) ||
    (form.getFieldState('reserve_percentage').isDirty === true &&
      form.getValues('reserve_percentage')[0] < currentReserve)

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const updatedEvent = await flip.updateEvent(event.id, {
      is_participating: data.is_participating,
      device_settings: event.device_settings.map((device) => ({
        device_id: device.device_id,
        backup_reserve_percentage: data.reserve_percentage[0],
      })),
    })
    setOpen(false)
    setEvent(updatedEvent)
    form.reset(data)
  }

  function handleRevertChanges() {
    form.reset()
  }

  return (
    <Form {...form}>
      <form className="w-full flex flex-col space-y-3">
        <FormField
          control={form.control}
          name="is_participating"
          render={({ field }) => (
            <FormItem>
              <Block
                label="Participating"
                value={
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                }
              />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="reserve_percentage"
          render={({ field }) => (
            <FormItem>
              <Block
                label="Reserve"
                value={
                  <>
                    <div className="mb-1 mt-0.5">{field.value[0]}%</div>
                    <div className="flex ">
                      <FormControl>
                        <Slider
                          min={0}
                          max={100}
                          step={1}
                          value={field.value}
                          onValueChange={field.onChange}
                        />
                      </FormControl>
                    </div>
                  </>
                }
              />
            </FormItem>
          )}
        />
        {form.formState.isDirty && (
          <>
            <Button
              onClick={() =>
                shouldWarn ? setOpen(true) : form.handleSubmit(onSubmit)()
              }
              type="button"
            >
              {form.formState.isSubmitting ? (
                <Spinner size={23} color="#fff" />
              ) : (
                'Save'
              )}
            </Button>
            <Button
              onClick={handleRevertChanges}
              variant="outline"
              type="button"
            >
              Cancel
            </Button>
          </>
        )}
        <AlertDialog
          open={open}
          setOpen={setOpen}
          title={<AlertCircleIcon />}
          description="Not participating in this event, or increasing your reserve, will reduce your earnings."
          onConfirm={form.handleSubmit(onSubmit)}
          onCancel={handleRevertChanges}
          confirmLabel={
            form.formState.isSubmitting ? (
              <Spinner size={23} color="#fff" />
            ) : (
              "Yes, I'm sure"
            )
          }
          cancelLabel="No, cancel"
        />
      </form>
    </Form>
  )
}

export default EventForm
