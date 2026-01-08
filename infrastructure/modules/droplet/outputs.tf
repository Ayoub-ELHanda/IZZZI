output "droplet_id" {
  description = "ID of the droplet"
  value       = digitalocean_droplet.app.id
}

output "droplet_ip" {
  description = "Public IP address of the droplet"
  value       = digitalocean_droplet.app.ipv4_address
}

output "droplet_private_ip" {
  description = "Private IP address of the droplet"
  value       = digitalocean_droplet.app.ipv4_address_private
}

output "droplet_name" {
  description = "Name of the droplet"
  value       = digitalocean_droplet.app.name
}
