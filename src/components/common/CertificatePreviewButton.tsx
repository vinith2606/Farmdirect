import { useEffect, useState } from 'react'
import { ExternalLink } from 'lucide-react'
import api from '@/services/api'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'

export function CertificatePreviewButton({ certificateId, compact = false }: { certificateId: number; compact?: boolean }) {
  const [imageUrl, setImageUrl] = useState('')
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl)
  }, [imageUrl])

  const openPreview = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    setLoading(true)
    setError('')

    try {
      const response = await api.get(`/certificates/${certificateId}/image`, { responseType: 'blob' })
      const nextImageUrl = URL.createObjectURL(response.data)
      setImageUrl(nextImageUrl)
      setOpen(true)
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message || 'Unable to load certificate image.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        type="button"
        size={compact ? 'icon' : 'sm'}
        variant={compact ? 'ghost' : 'outline'}
        loading={loading}
        onClick={openPreview}
        title="View certificate"
        aria-label="View certificate"
      >
        <ExternalLink className="h-4 w-4" />
        {!compact && 'View certificate'}
      </Button>
      {error && <span role="alert" className="text-xs text-danger">{error}</span>}
      <Modal open={open} onClose={() => setOpen(false)} title="Farmer certificate" size="lg">
        {imageUrl && <img src={imageUrl} alt="Uploaded farmer certificate" className="mx-auto max-h-[70vh] w-auto max-w-full object-contain" />}
      </Modal>
    </>
  )
}
