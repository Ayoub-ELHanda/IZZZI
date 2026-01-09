variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "region" {
  description = "Digital Ocean region"
  type        = string
}

variable "vpc_id" {
  description = "ID of the VPC"
  type        = string
}

variable "droplet_size" {
  description = "Droplet size"
  type        = string
  default     = "s-2vcpu-4gb"
}

variable "droplet_image" {
  description = "Droplet image"
  type        = string
  default     = "ubuntu-24-04-x64"
}

variable "ssh_public_key" {
  description = "SSH public key content"
  type        = string
  sensitive   = true
}

variable "ssh_key_name" {
  description = "Name of the SSH key"
  type        = string
}

variable "enable_monitoring" {
  description = "Enable monitoring"
  type        = bool
  default     = true
}

variable "enable_backups" {
  description = "Enable backups"
  type        = bool
  default     = false
}

variable "enable_ipv6" {
  description = "Enable IPv6"
  type        = bool
  default     = false
}

variable "do_project_id" {
  description = "Digital Ocean project ID"
  type        = string
  default     = ""
}

variable "common_tags" {
  description = "Common tags"
  type        = map(string)
  default     = {}
}
