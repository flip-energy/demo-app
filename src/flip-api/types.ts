import { v4 as uuidv4 } from 'uuid'

export type UUID = ReturnType<typeof uuidv4>

/**
 * Device
 */
export interface Device {
  /**
   * Structure depends on `type`. They are not user-adjustable and should be configured during
   * installation / commissioning.
   */
  attributes: DeviceBatteryAttributes
  /**
   * Structure depends on `type`
   */
  configuration: DeviceBatteryConfig
  /**
   * Created At
   */
  created_at: Date
  /**
   * Id
   */
  id: string
  install_date?: Date | null
  /**
   * Manufacturer Name
   */
  manufacturer_name: string
  /**
   * Product Name
   */
  product_name: string
  /**
   * Serial Number
   */
  serial_number: string
  type: DeviceType
  /**
   * Updated At
   */
  updated_at: Date
}

/**
 * DeviceBatteryAttributes
 *
 * Structure depends on `type`. They are not user-adjustable and should be configured during
 * installation / commissioning.
 */
export interface DeviceBatteryAttributes {
  /**
   * Nominal power capacity of the battery per manufacturer specification, in watt-hours
   */
  battery_capacity_wh: number
  /**
   * The rated power the battery can continuously discharge at per manufacturer specification,
   * in watts.
   */
  battery_power_input_w: number
  /**
   * The rated power the battery can continuously charge at per manufacturer specification, in
   * watts.
   */
  battery_power_output_w: number
}

/**
 * Structure depends on `type`
 *
 * DeviceBatteryConfig
 */
export interface DeviceBatteryConfig {
  /**
   * Use-configurable level that the battery should reserve as a minimum.
   */
  reserve_percentage: number
}

export interface DeviceUpdate {
  attributes?: DeviceBatteryAttributes
  configuration?: DeviceBatteryConfig
}

/**
 * DeviceType
 */
export enum DeviceType {
  BATTERY = 'BATTERY',
  EV_CHARGER = 'EV_CHARGER',
}

/**
 * Site
 */
export interface Site {
  /**
   * City
   */
  city?: null | string
  /**
   * Created At
   */
  created_at: Date
  email?: null | string
  first_name?: null | string
  /**
   * Id, The ID of the site in your system.
   */
  id: string
  last_name?: null | string
  /**
   * Service Account Id, An ID assigned to the residential customer by the utility. Can
   * typically be found on the utility bill.
   */
  service_account_id?: null | string
  /**
   * State
   */
  state_code?: null | string
  /**
   * Street Address
   */
  street_address?: null | string
  /**
   * Street Address2
   */
  street_address2?: null | string
  tariff_id?: null | string
  /**
   * Updated At
   */
  updated_at: Date
  /**
   * Zip Code, In the sandbox, use zip codes 88800, 88801 or 88802 to match with test programs.
   */
  zip_code?: null | string
}

/**
 * EnrollmentCreateIn
 */
export interface EnrollmentCreate {
  /**
   * A list of devices to enroll
   */
  device_ids: string[]
  enroll_method: EnrollMethodType
  has_agreed_to_terms_and_conditions?: boolean | null
  /**
   * Program ID, ID of the program to enroll in
   */
  program_id: string
  program_specific_attributes?: ProgramSpecificAttribute[]
  terms_and_conditions_version?: null | string
}

export const enum EnrollmentStatus {
  ACTIVE = 'ACTIVE',
  NEEDS_ACTION = 'NEEDS_ACTION',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
  UNENROLLED = 'UNENROLLED',
}

/**
 * Enrollment
 */
export interface Enrollment {
  device_ids: string[]
  enroll_method: EnrollMethodType
  /**
   * Enrolled At
   */
  enrolled_at: Date | null
  has_agreed_to_terms_and_conditions: boolean | null
  /**
   * Id
   */
  id: UUID
  /**
   * Program Id
   */
  program_id: UUID
  program_specific_attributes: ProgramSpecificAttribute[]
  site_id: string
  status: EnrollmentStatus
  status_reason: null | string
  terms_and_conditions_version: null | string
  /**
   * Unenrolled At
   */
  unenrolled_at: Date | null
}

/**
 * EnrollMethodType
 */
export enum EnrollMethodType {
  AUTO_ENROLL = 'AUTO_ENROLL',
  USER_ACTION = 'USER_ACTION',
}

export interface ProgramSpecificAttribute {
  name: string
  value: string
}

/**
 * Program
 */
export interface Program {
  can_auto_enroll: boolean
  /**
   * Created At
   */
  created_at: Date
  description: string
  /**
   * Estimated one-time upfront earnings in the program, based on the site information
   */
  earnings_for_site_upfront: number
  /**
   * Estimated yearly recurring earnings in the program, based on the site information
   */
  earnings_for_site_yearly: number
  /**
   * Eligible Device Types
   */
  eligible_device_types: DeviceType[]
  /**
   * A program might require special information from the end user on enrollment. If it does,
   * this array will contain each of them. They should be used to dynamically convert into
   * form fields.
   */
  enrollment_form: EnrollmentForm[]
  /**
   * Id
   */
  id: UUID
  /**
   * Can be null if the minimum commitment is currently not known.
   */
  minimum_commitment_months: number | null
  /**
   * Name
   */
  name: string
  /**
   * List of calendar months (range 1-12) in which the program is active
   */
  participation_months: number[]
  /**
   * If a program requires terms and conditions to be agreed with, the full text of the
   * current version, in Markdown format, will be provided here. It should be displayed to the
   * user.
   */
  terms_and_conditions_text: null | string
  /**
   * If a program requires terms and conditions to be agreed with, the current version will be
   * provided here. It should not be displayed to the user.
   */
  terms_and_conditions_version: null | string
  /**
   * Updated At
   */
  updated_at: Date
}

export interface EnrollmentForm {
  /**
   * The human-readable attribute name to include in your form
   */
  label: string
  /**
   * The machine-readable attribute name to use over the API
   */
  name: string
  type: EnrollmentFormValueType
}

export enum EnrollmentFormValueType {
  Boolean = 'boolean',
  Number = 'number',
  String = 'string',
}

export type SiteToken = {
  site_access_token: string
  expires_at: Date
}

export interface EventUpdate {
  device_settings?: EventBatterySettings[]
  is_participating?: boolean
}

/**
 * Event
 */
export interface Event {
  created_at: Date
  /**
   * Settings per device for the event.
   */
  device_settings: EventBatterySettings[]
  /**
   * Duration of the event, in seconds. If null, the event will continue until the utility
   * sends a termination signal.
   */
  duration_s: number | null
  /**
   * Time at which the event ends. If null, the event will continue until the utility sends a
   * termination signal.
   */
  ends_at: string | null
  id: UUID
  is_participating: boolean
  site_id: string
  program_id: UUID
  /**
   * Use this to build a schedule for the event to show the end-user. Not enough information
   * is provided here to send instructions to devices. Please use Commands instead.
   */
  schedule: EventScheduleItem[]
  /**
   * Time at which the event starts.
   */
  starts_at: string
  status: EventStatus
  updated_at: Date
}

/**
 * EventBatterySettings
 */
export interface EventBatterySettings {
  /**
   * The minimum state of charge the battery will keep when discharging.
   */
  backup_reserve_percentage?: number | null
  device_id: string
  /**
   * The maximum state of charge the battery will charge to.
   */
  maximum_charge_percentage?: number | null
}

export interface EventScheduleItem {
  device_ids: string[]
  /**
   * Duration of the action, in seconds. If null, the action should continue until replaced by
   * another one.
   */
  duration_s: number | null
  /**
   * Time at which the action should stop. If null, the action should continue until replaced
   * by another one.
   */
  ends_at: string | null
  /**
   * Whether the command is not part of the event itself but in preparation for the event. For
   * instance, charging a battery before a discharging event.
   */
  is_preparatory_action: boolean
  /**
   * The mode the battery should go into during this period.
   */
  mode: BatteryMode
  /**
   * Time at which the action should start. Note that this may be before the event itself has
   * started. For instance, in order to pre-charge a battery prior to a discharge event.
   */
  starts_at: string
}

/**
 * The mode the battery should go into during this period.
 *
 * BatteryMode
 */
export enum BatteryMode {
  BACKUP = 'BACKUP',
  CHARGE = 'CHARGE',
  DISCHARGE = 'DISCHARGE',
  SAVINGS = 'SAVINGS',
  SELF_CONSUMPTION = 'SELF_CONSUMPTION',
  STANDBY = 'STANDBY',
}

/**
 * EventStatus
 */
export enum EventStatus {
  ACTIVE = 'ACTIVE',
  CANCELED = 'CANCELED',
  COMPLETED = 'COMPLETED',
  UPCOMING = 'UPCOMING',
}

export enum WebhookType {
  EVENT_CREATED = 'event.created',
  ENROLLMENT_UPDATED = 'enrollment.updated',
}

export type Webhook =
  | {
      event_type: WebhookType.EVENT_CREATED
      event_object: Event
    }
  | { event_type: WebhookType.ENROLLMENT_UPDATED; event_object: Enrollment }
