variable "do_token" {
  description = "DigitalOcean API token"
  type        = string
  sensitive   = true
}

variable "project_name" {
  description = "Name of the project (used for resource naming and tagging)"
  type        = string
  default     = "izzzi"
}

variable "environment" {
  description = "Environment name (staging, production, dev)"
  type        = string
  default     = "production"
  validation {
    condition     = contains(["staging", "production", "dev"], var.environment)
    error_message = "Environment must be one of: staging, production, dev"
  }
}

variable "region" {
  description = "Digital Ocean region for resources deployment (fra1 for Frankfurt or ams3 for Amsterdam)"
  type        = string
  default     = "fra1"
  validation {
    condition     = contains(["fra1", "ams3", "nyc3", "sgp1", "sfo3"], var.region)
    error_message = "Region must be one of: fra1, ams3, nyc3, sgp1, sfo3"
  }
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "droplet_size" {
  description = "Droplet size for the application server"
  type        = string
  default     = "s-2vcpu-4gb"
}

variable "droplet_image" {
  description = "Droplet image/snapshot to use"
  type        = string
  default     = "ubuntu-24-04-x64"
}

variable "ssh_public_key" {
  description = "SSH public key content for droplet access"
  type        = string
  sensitive   = true
}

variable "ssh_key_name" {
  description = "Name of the SSH key in Digital Ocean"
  type        = string
  default     = "izzzi-deploy-key"
}

variable "enable_monitoring" {
  description = "Enable Digital Ocean monitoring agent"
  type        = bool
  default     = true
}

variable "enable_backups" {
  description = "Enable automatic backups"
  type        = bool
  default     = false
}

variable "enable_ipv6" {
  description = "Enable IPv6 support"
  type        = bool
  default     = false
}

variable "allowed_ssh_ips" {
  description = "List of IP addresses allowed to SSH into droplets"
  type        = list(string)
  default     = ["0.0.0.0/0"] # Change this to your IP for better security
}

variable "do_project_id" {
  description = "Digital Ocean project ID to associate resources with"
  type        = string
  default     = ""
}

variable "domain_name" {
  description = "Domain name for DNS records (optional, leave empty to skip DNS setup)"
  type        = string
  default     = ""
}

variable "create_spaces" {
  description = "Create Digital Ocean Spaces buckets for backups and assets"
  type        = bool
  default     = false
}

variable "common_tags" {
  description = "Common tags to apply to all resources"
  type        = map(string)
  default     = {}
}
