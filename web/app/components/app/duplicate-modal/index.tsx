'use client'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RiCloseLine } from '@remixicon/react'
import AppIconPicker from '../../base/app-icon-picker'
import cn from '@/utils/classnames'
import Modal from '@/app/components/base/modal'
import Button from '@/app/components/base/button'
import Input from '@/app/components/base/input'
import Toast from '@/app/components/base/toast'
import AppIcon from '@/app/components/base/app-icon'
import { useProviderContext } from '@/context/provider-context'
import AppsFull from '@/app/components/billing/apps-full-in-dialog'
import type { AppIconType } from '@/types/app'

export type DuplicateAppModalProps = {
  appName: string
  icon_type: AppIconType | null
  icon: string
  icon_background?: string | null
  icon_url?: string | null
  show: boolean
  onConfirm: (info: {
    name: string
    icon_type: AppIconType
    icon: string
    icon_background?: string | null
  }) => Promise<void>
  onHide: () => void
}

const DuplicateAppModal = ({
  appName,
  icon_type,
  icon,
  icon_background,
  icon_url,
  show = false,
  onConfirm,
  onHide,
}: DuplicateAppModalProps) => {
  const { t } = useTranslation()

  const [name, setName] = React.useState(appName)

  const [showAppIconPicker, setShowAppIconPicker] = useState(false)
  const [appIcon, setAppIcon] = useState(
    icon_type === 'image'
      ? { type: 'image' as const, url: icon_url, fileId: icon }
      : { type: 'emoji' as const, icon, background: icon_background },
  )

  const { plan, enableBilling } = useProviderContext()
  const isAppsFull = (enableBilling && plan.usage.buildApps >= plan.total.buildApps)

  const submit = () => {
    if (!name.trim()) {
      Toast.notify({ type: 'error', message: t('explore.appCustomize.nameRequired') })
      return
    }
    onConfirm({
      name,
      icon_type: appIcon.type,
      icon: appIcon.type === 'emoji' ? appIcon.icon : appIcon.fileId,
      icon_background: appIcon.type === 'emoji' ? appIcon.background : undefined,
    })
    onHide()
  }

  return (
    <>
      <Modal
        isShow={show}
        onClose={() => { }}
        className={cn('relative !max-w-[480px]', 'px-8')}
      >
        <div className='absolute right-4 top-4 p-2 cursor-pointer' onClick={onHide}>
          <RiCloseLine className='w-4 h-4 text-text-tertiary' />
        </div>
        <div className='relative mt-3 mb-9 text-xl font-semibold leading-[30px] text-text-primary'>{t('app.duplicateTitle')}</div>
        <div className='mb-9 system-sm-regular text-text-secondary'>
          <div className='mb-2 system-md-medium'>{t('explore.appCustomize.subTitle')}</div>
          <div className='flex items-center justify-between space-x-2'>
            <AppIcon
              size='large'
              onClick={() => { setShowAppIconPicker(true) }}
              className='cursor-pointer'
              iconType={appIcon.type}
              icon={appIcon.type === 'image' ? appIcon.fileId : appIcon.icon}
              background={appIcon.type === 'image' ? undefined : appIcon.background}
              imageUrl={appIcon.type === 'image' ? appIcon.url : undefined}
            />
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              className='h-10'
            />
          </div>
          {isAppsFull && <AppsFull loc='app-duplicate-create' />}
        </div>
        <div className='flex flex-row-reverse'>
          <Button disabled={isAppsFull} className='w-24 ml-2' variant='primary' onClick={submit}>{t('app.duplicate')}</Button>
          <Button className='w-24' onClick={onHide}>{t('common.operation.cancel')}</Button>
        </div>
      </Modal>
      {showAppIconPicker && <AppIconPicker
        onSelect={(payload) => {
          setAppIcon(payload)
          setShowAppIconPicker(false)
        }}
        onClose={() => {
          setAppIcon(icon_type === 'image'
            ? { type: 'image', url: icon_url!, fileId: icon }
            : { type: 'emoji', icon, background: icon_background! })
          setShowAppIconPicker(false)
        }}
      />}
    </>

  )
}

export default DuplicateAppModal
