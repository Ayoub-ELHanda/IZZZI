output "vpc_id" {
  description = "ID of the created VPC"
  value       = digitalocean_vpc.main.id
}

output "vpc_cidr" {
  description = "CIDR block of the VPC"
  value       = digitalocean_vpc.main.ip_range
}

output "vpc_name" {
  description = "Name of the VPC"
  value       = digitalocean_vpc.main.name
}
