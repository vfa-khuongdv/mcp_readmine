# Makefile for Redmine MCP Server

# Variables
NPM := npm
NPX := npx
BIOME := $(NPX) @biomejs/biome

# Phony targets
.PHONY: all install build dev lint format check check-apply clean test

# Default target
all: install build

# Install dependencies
install:
	$(NPM) install

# Build the project
build:
	$(NPM) run build

# Run in development mode
dev:
	$(NPM) run dev

# Run tests
test:
	$(NPM) run test

# Lint code using Biome
lint:
	$(BIOME) lint ./src

# Format code using Biome
format:
	$(BIOME) format --write ./src

# Check code (lint + format verification)
check:
	$(BIOME) check ./src

# Apply safe fixes and formatting
check-apply:
	$(BIOME) check --write ./src

# Clean build artifacts
clean:
	rm -rf dist
