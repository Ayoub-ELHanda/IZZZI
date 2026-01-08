variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "droplet_ids" {
  description = "List of droplet IDs to apply firewall rules to"
  type        = list(number)
}

variable "vpc_cidr" {
  description = "CIDR block of the VPC"
  type        = string
}

variable "allowed_ssh_ips" {
  description = "List of IP addresses allowed to SSH"
  type        = list(string)
}

variable "common_tags" {
  description = "Common tags"
  type        = map(string)
  default     = {}
}
