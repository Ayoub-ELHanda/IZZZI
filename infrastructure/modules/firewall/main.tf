locals {
  web_firewall_name       = "${var.project_name}-${var.environment}-fw-web"
  internal_firewall_name  = "${var.project_name}-${var.environment}-fw-internal"
  management_firewall_name = "${var.project_name}-${var.environment}-fw-management"
  
  common_tags = merge(
    {
      project     = var.project_name
      managedby   = "terraform"
      environment = var.environment
    },
    var.common_tags
  )
  
  limited_common_tags = {
    project     = local.common_tags.project
    managedby   = local.common_tags.managedby
    environment = local.common_tags.environment
  }
  
  # All tags that will be used
  all_tags = concat(
    [for k, v in local.limited_common_tags : "${k}:${v}"],
    ["firewall:web", "type:public", "firewall:internal", "type:private", "firewall:management", "type:admin"]
  )
}

# Create tags before using them
resource "digitalocean_tag" "firewall_tags" {
  for_each = toset(local.all_tags)
  name     = each.value
}

# Web Firewall - For HTTP/HTTPS traffic
resource "digitalocean_firewall" "web" {
  name = local.web_firewall_name

  # Inbound rules - Web traffic
  inbound_rule {
    protocol         = "tcp"
    port_range       = "80"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  inbound_rule {
    protocol         = "tcp"
    port_range       = "443"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  # Outbound rules - Allow all outbound traffic
  outbound_rule {
    protocol              = "tcp"
    port_range            = "1-65535"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {
    protocol              = "udp"
    port_range            = "1-65535"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {
    protocol              = "icmp"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }

  # Apply to all droplets
  droplet_ids = var.droplet_ids

  tags = concat(
    [for k, v in local.limited_common_tags : "${k}:${v}"],
    ["firewall:web", "type:public"]
  )

  depends_on = [
    digitalocean_tag.firewall_tags
  ]

  lifecycle {
    create_before_destroy = true
  }
}

# Internal Firewall - For database and service communication within VPC
resource "digitalocean_firewall" "internal" {
  name = local.internal_firewall_name

  # PostgreSQL
  inbound_rule {
    protocol         = "tcp"
    port_range       = "5432"
    source_addresses = [var.vpc_cidr]
  }

  # Redis
  inbound_rule {
    protocol         = "tcp"
    port_range       = "6379"
    source_addresses = [var.vpc_cidr]
  }

  # Docker Compose services (3000 for frontend, 4000 for backend)
  inbound_rule {
    protocol         = "tcp"
    port_range       = "3000"
    source_addresses = [var.vpc_cidr]
  }

  inbound_rule {
    protocol         = "tcp"
    port_range       = "4000"
    source_addresses = [var.vpc_cidr]
  }

  # Outbound rules - Allow all traffic to VPC
  outbound_rule {
    protocol              = "tcp"
    port_range            = "1-65535"
    destination_addresses = [var.vpc_cidr]
  }

  outbound_rule {
    protocol              = "udp"
    port_range            = "1-65535"
    destination_addresses = [var.vpc_cidr]
  }

  outbound_rule {
    protocol              = "icmp"
    destination_addresses = [var.vpc_cidr]
  }

  # Apply to all droplets
  droplet_ids = var.droplet_ids

  tags = concat(
    [for k, v in local.limited_common_tags : "${k}:${v}"],
    ["firewall:internal", "type:private"]
  )

  lifecycle {
    create_before_destroy = true
  }
}

# Management Firewall - For SSH access
resource "digitalocean_firewall" "management" {
  name = local.management_firewall_name

  # Inbound rules - SSH from allowed IPs only
  inbound_rule {
    protocol         = "tcp"
    port_range       = "22"
    source_addresses = var.allowed_ssh_ips
  }

  # Outbound rules - Allow all outbound traffic
  outbound_rule {
    protocol              = "tcp"
    port_range            = "1-65535"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {
    protocol              = "udp"
    port_range            = "1-65535"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {
    protocol              = "icmp"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }

  # Apply to all droplets
  droplet_ids = var.droplet_ids

  tags = concat(
    [for k, v in local.limited_common_tags : "${k}:${v}"],
    ["firewall:management", "type:admin"]
  )

  depends_on = [
    digitalocean_tag.firewall_tags
  ]

  lifecycle {
    create_before_destroy = true
  }
}
