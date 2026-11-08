import {Select, Spinner, Text} from '@sanity/ui'
import {type ChangeEvent, useEffect, useState} from 'react'
import {set, unset, useClient, type ReferenceInputProps} from 'sanity'

const apiVersion = '2026-11-08'

type SeriesOption = {
  _id: string
  seriesNumber: number
  title?: string
  titleMalayalam?: string
}

export function SeriesReferenceInput(props: ReferenceInputProps) {
  const {onChange, readOnly, value} = props
  const client = useClient({apiVersion})
  const [seriesOptions, setSeriesOptions] = useState<SeriesOption[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isCurrent = true

    void client
      .fetch<SeriesOption[]>(
        `*[_type == "series" && !(_id in path("drafts.**"))]
          | order(seriesNumber asc, title asc) {
            _id,
            seriesNumber,
            title,
            titleMalayalam
          }`,
      )
      .then((items) => {
        if (isCurrent) {
          setSeriesOptions(items)
          setIsLoading(false)
        }
      })

    return () => {
      isCurrent = false
    }
  }, [client])

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const seriesId = event.currentTarget.value

    onChange(seriesId ? set({_type: 'reference', _ref: seriesId}) : unset())
  }

  if (isLoading) {
    return <Spinner muted />
  }

  return (
    <div>
      <Select
        aria-label="Series"
        disabled={readOnly}
        onChange={handleChange}
        value={value?._ref || ''}
      >
        <option value="">Select a series</option>
        {seriesOptions.map((series) => (
          <option key={series._id} value={series._id}>
            {`Series ${series.seriesNumber} · ${series.titleMalayalam || series.title || 'Untitled'}`}
          </option>
        ))}
      </Select>
      {seriesOptions.length === 0 && (
        <Text muted size={1}>
          Publish a Series before assigning artworks to it.
        </Text>
      )}
    </div>
  )
}
