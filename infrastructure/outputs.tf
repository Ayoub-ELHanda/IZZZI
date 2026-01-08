output "vpc_id" {
  description = "ID of the created VPC"
  value       = module.networking.vpc_id
}

output "vpc_cidr" {
  description = "CIDR block of the VPC"
  value       = module.networking.vpc_cidr
}

output "droplet_id" {
  description = "ID of the created droplet"
  value       = module.droplet.droplet_id
}

output "droplet_ip" {
  description = "Public IP address of the droplet"
  value       = module.droplet.droplet_ip
}

output "droplet_private_ip" {
  description = "Private IP address of the droplet"
  value       = module.droplet.droplet_private_ip
}

output "ssh_command" {
  description = "SSH command to connect to the droplet"
  value       = "ssh deploy@${module.droplet.droplet_ip}"
}

output "firewall_ids" {
  description = "IDs of the created firewalls"
  value       = module.firewall.firewall_ids
}

output "dns_records" {
  description = "DNS records created (if DNS module is enabled)"
  value       = var.domain_name != "" ? module.dns[0].dns_records : {}
}

output "spaces_buckets" {
  description = "Digital Ocean Spaces buckets created (if enabled)"
  value       = var.create_spaces ? module.spaces[0].bucket_names : []
}
